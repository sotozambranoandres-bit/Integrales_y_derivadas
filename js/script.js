// script.js

// Lógica para las animaciones de aparición suave al hacer scroll (Fade-in)
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// Lógica para los botones de Mostrar/Ocultar Solución
function toggleSolution(id) {
    const container = document.getElementById(id);
    const button = container.previousElementSibling; 

    if (container.classList.contains('show')) {
        container.classList.remove('show');
        button.innerHTML = '👁️ Mostrar Solución';
    } else {
        container.classList.add('show');
        button.innerHTML = '🙈 Ocultar Solución';
    }
}

// Lógica para el Menú Móvil (Hamburguesa)
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '✕'; 
            } else {
                mobileMenuBtn.innerHTML = '☰'; 
            }
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
            });
        });
    }
});

// ==========================================================================
// LÓGICA DEL QUIZ INTERACTIVO (EXAMEN) - ADAPTADO A INTEGRALES
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    
    if (!quizContainer) return;

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const nextBtnContainer = document.getElementById('next-btn-container');
    const btnNext = document.getElementById('btn-next');
    const questionTracker = document.getElementById('question-tracker');
    const progressBar = document.getElementById('progress-bar');
    const resultContainer = document.getElementById('result-container');
    const finalScoreDisplay = document.getElementById('final-score');
    const resultMessage = document.getElementById('result-message');

    // Base de datos de preguntas para INTEGRALES
    const quizData = [
        {
            question: "¿Cuál es la integral indefinida de \\( f(x) = x^2 \\)?",
            options: ["\\( \\frac{x^3}{3} + C \\)", "\\( 2x + C \\)", "\\( x^3 + C \\)", "\\( \\frac{x^2}{2} + C \\)"],
            correctIndex: 0,
            feedback: "Por la regla de la potencia para integrales, sumamos 1 al exponente y dividimos entre el nuevo exponente: \\( \\frac{x^{2+1}}{2+1} \\)."
        },
        {
            question: "¿Cuál es la integral de una constante \\( k \\)?",
            options: ["\\( 0 \\)", "\\( k \\)", "\\( kx + C \\)", "\\( x + k \\)"],
            correctIndex: 2,
            feedback: "La integral de una constante es la constante multiplicada por la variable de integración, más la constante de integración \\( C \\)."
        },
        {
            question: "¿Cuál es la integral de \\( f(x) = \\cos(x) \\)?",
            options: ["\\( \\sin(x) + C \\)", "\\( -\\sin(x) + C \\)", "\\( \\cos(x) + C \\)", "\\( -\\cos(x) + C \\)"],
            correctIndex: 0,
            feedback: "Dado que la derivada de \\( \\sin(x) \\) es \\( \\cos(x) \\), la integral de \\( \\cos(x) \\) es \\( \\sin(x) + C \\)."
        },
        {
            question: "¿Cuál es la integral de \\( f(x) = \\frac{1}{x} \\)?",
            options: ["\\( \\frac{x^0}{0} + C \\)", "\\( \\ln|x| + C \\)", "\\( \\frac{1}{x^2} + C \\)", "\\( e^x + C \\)"],
            correctIndex: 1,
            feedback: "La integral de \\( 1/x \\) es el logaritmo natural del valor absoluto de \\( x \\), ya que la derivada de \\( \\ln(x) \\) es \\( 1/x \\)."
        },
        {
            question: "¿Cuál es la integral de \\( f(x) = e^x \\)?",
            options: ["\\( x e^{x-1} + C \\)", "\\( e^x + C \\)", "\\( \\ln(x) + C \\)", "\\( e^{x+1} + C \\)"],
            correctIndex: 1,
            feedback: "La función exponencial natural es especial porque su derivada e integral son ella misma (más C)."
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;

    function loadQuestion() {
        answered = false;
        const currentQuiz = quizData[currentQuestionIndex];
        
        questionTracker.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizData.length}`;
        progressBar.style.width = `${((currentQuestionIndex) / quizData.length) * 100}%`;
        
        questionText.innerHTML = currentQuiz.question;
        
        optionsContainer.innerHTML = '';
        feedbackContainer.className = 'feedback-box hidden';
        feedbackContainer.innerHTML = '';
        nextBtnContainer.classList.add('hidden');

        currentQuiz.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerHTML = option;
            button.onclick = () => selectOption(button, index);
            optionsContainer.appendChild(button);
        });

        if (window.MathJax) {
            MathJax.typesetPromise([document.getElementById('quiz-container')]).catch((err) => console.log(err));
        }
    }

    function selectOption(selectedButton, index) {
        if (answered) return;
        answered = true;

        const currentQuiz = quizData[currentQuestionIndex];
        const isCorrect = (index === currentQuiz.correctIndex);
        
        const allButtons = optionsContainer.querySelectorAll('.option-btn');
        
        if (isCorrect) {
            selectedButton.classList.add('correct');
            score++;
            showFeedback('success', "¡Correcto! " + currentQuiz.feedback);
        } else {
            selectedButton.classList.add('incorrect');
            allButtons[currentQuiz.correctIndex].classList.add('correct');
            showFeedback('error', "Incorrecto. " + currentQuiz.feedback);
        }

        allButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'default';
        });
        
        nextBtnContainer.classList.remove('hidden');
    }

    function showFeedback(type, text) {
        feedbackContainer.className = `feedback-box ${type}`;
        feedbackContainer.innerHTML = text;
        
        if (window.MathJax) {
            MathJax.typesetPromise([feedbackContainer]).catch((err) => console.log(err));
        }
    }

    function showResults() {
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        
        progressBar.style.width = '100%';
        
        finalScoreDisplay.textContent = `${score}/${quizData.length}`;
        
        if (score === quizData.length) {
            resultMessage.innerHTML = "¡Eres un maestro de las integrales! 🏆<br>Puntaje Perfecto.";
        } else if (score >= 3) {
            resultMessage.innerHTML = "¡Muy buen trabajo! Tienes bases sólidas. 👍";
        } else {
            resultMessage.innerHTML = "Sigue practicando, repasa las reglas básicas y vuelve a intentarlo. 📚";
        }
    }

    btnNext.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    loadQuestion();
});
