// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', function() {
  // helper function for creating elements
  function createElement(type, attrs, ...children) {
    const ele = document.createElement(type);

    // add element attributes
    for (const prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        ele.setAttribute(prop, attrs[prop]);
      }
    }

    // add child nodes to element
    children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));

    return ele;
  }

  // Function to fetch all questions from the server
  async function fetchQuestions() {
    try {
      const response = await fetch('/questions/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const questions = await response.json();
      displayQuestions(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  // Function to display questions on the page
  function displayQuestions(questions) {
    const mainElement = document.querySelector('main');
    
    // Keep the Ask a Question button
    const askButton = document.getElementById('btn-show-modal-question');
    
    // Clear current content except the button
    mainElement.innerHTML = '';
    mainElement.appendChild(askButton);
    
    // Add each question to the page
    questions.forEach(question => {
      const article = createElement('article', {});
      const heading = createElement('h3', {}, question.question);
      article.appendChild(heading);
      
      // Create a list for answers if there are any
      if (question.answers && question.answers.length > 0) {
        const answersList = createElement('ul', {});
        
        question.answers.forEach(answer => {
          const answerItem = createElement('li', {}, answer);
          answersList.appendChild(answerItem);
        });
        
        article.appendChild(answersList);
      }
      
      // Add button to add an answer
      const answerButton = createElement('input', {
        type: 'button',
        value: 'Add an Answer',
        'data-question-id': question._id
      });
      
      article.appendChild(answerButton);
      mainElement.appendChild(article);
    });
  }

  // Set up event listeners
  function setupEventListeners() {
    // Show question modal
    document.getElementById('btn-show-modal-question').addEventListener('click', function() {
      const modal = document.getElementById('modal-question');
      modal.classList.add('open');
      // Alternative: modal.showModal();
    });
    
    // Close modals
    document.querySelectorAll('.modal .close').forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.classList.remove('open');
        // Alternative: modal.close();
      });
    });
    
    // Create question
    document.getElementById('create-question').addEventListener('click', createQuestion);
    
    // Event delegation for "Add an Answer" buttons
    document.querySelector('main').addEventListener('click', function(event) {
      if (event.target.matches('input[value="Add an Answer"]')) {
        const questionId = event.target.getAttribute('data-question-id');
        showAnswerModal(questionId);
      }
    });
    
    // Create answer
    document.getElementById('create-answer').addEventListener('click', createAnswer);
  }

  // Function to show the answer modal
  function showAnswerModal(questionId) {
    const modal = document.getElementById('modal-answer');
    document.getElementById('question-id').value = questionId;
    modal.classList.add('open');
  }

  // Function to create a new question
  async function createQuestion() {
    const questionText = document.getElementById('question-text').value.trim();
    
    if (!questionText) {
      console.error('Question text is required');
      return;
    }
    
    try {
      const response = await fetch('/questions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: questionText })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Close the modal
      const modal = document.getElementById('modal-question');
      modal.classList.remove('open');
      // Alternative: modal.close();
      
      // Clear the input field
      document.getElementById('question-text').value = '';
      
      // Refresh the questions
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
    }
  }

  // Function to add an answer to a question
  async function createAnswer() {
    const answerText = document.getElementById('answer-text').value.trim();
    const questionId = document.getElementById('question-id').value;
    
    if (!answerText || !questionId) {
      console.error('Answer text and question ID are required');
      return;
    }
    
    try {
      const response = await fetch(`/questions/${questionId}/answers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: answerText })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Close the modal
      const modal = document.getElementById('modal-answer');
      modal.classList.remove('open');
      
      // Clear the input field
      document.getElementById('answer-text').value = '';
      
      // Refresh the questions
      fetchQuestions();
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  }

  // Initialize the application
  fetchQuestions();
  setupEventListeners();
});