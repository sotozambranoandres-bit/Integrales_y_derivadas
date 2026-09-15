// script.js

// Lógica para las animaciones de aparición suave al hacer scroll (Fade-in)
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los elementos que tienen la clase 'fade-in'
    const fadeElements = document.querySelectorAll('.fade-in');
    // Configuramos el "observador" que detecta cuando un elemento entra en la pantalla
    const observerOptions = {
        root: null, // Usa el viewport (la pantalla visible)
        rootMargin: '0px',
        threshold: 0.15 // El 15% del elemento debe ser visible para disparar la animación
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento ya es visible en la pantalla
            if (entry.isIntersecting) {
                // Le agregamos la clase 'visible' para que CSS haga la animación
                entry.target.classList.add('visible');
                // Dejamos de observarlo para que la animación solo ocurra una vez
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Le decimos al observador que vigile todos los elementos 'fade-in'
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// Lógica para los botones de Mostrar/Ocultar Solución
function toggleSolution(id) {
    const container = document.getElementById(id);
    // El botón está justo antes del contenedor en el HTML
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
        // Al hacer clic en el botón de hamburguesa
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Cambiar icono entre hamburguesa y X
            if (navMenu.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '✕'; // Icono de cerrar
            } else {
                mobileMenuBtn.innerHTML = '☰'; // Icono de hamburguesa
            }
        });

        // Cerrar menú automáticamente al hacer clic en cualquiera de los enlaces
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
// LÓGICA DEL QUIZ INTERACTIVO (EXAMEN)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    
    // Si no estamos en la página del quiz, ignorar este código
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

    // Base de datos de preguntas
    const quizData = [
        {
            question: "¿Cuál es la derivada de \\( f(x) = x^3 \\)?",
            options: ["\\( 3x^2 \\)", "\\( x^2 \\)", "\\( 3x^3 \\)", "\\( \\frac{x^4}{4} \\)"],
            correctIndex: 0,
            feedback: "¡Correcto! Usamos la regla de la potencia: bajamos el 3 y restamos 1 al exponente."
        },
        {
            question: "¿Cuál es la derivada de una constante \\( c \\)?",
            options: ["\\( c \\)", "\\( 1 \\)", "\\( 0 \\)", "\\( x \\)"],
            correctIndex: 2,
            feedback: "¡Exacto! La tasa de cambio de un valor constante es siempre 0."
        },
        {
            question: "¿Cuál es la derivada de \\( f(x) = \\sin(x) \\)?",
            options: ["\\( \\cos(x) \\)", "\\( -\\cos(x) \\)", "\\( -\\sin(x) \\)", "\\( \\tan(x) \\)"],
            correctIndex: 0,
            feedback: "¡Muy bien! Es una de las reglas trigonométricas fundamentales."
        },
        {
            question: "Aplica la regla de la cadena y simplifica: ¿Cuál es la derivada de \\( f(x) = (2x + 1)^2 \\)?",
            options: ["\\( 4x + 2 \\)", "\\( 8x + 2 \\)", "\\( 8x + 4 \\)", "\\( 4(x + 1) \\)"],
            correctIndex: 2,
            feedback: "¡Excelente! Regla de la cadena: \\( 2(2x + 1) \\cdot 2 = 4(2x + 1) \\). Al simplificar con la propiedad distributiva, el 4 multiplica a ambos términos: \\( 8x + 4 \\)."
        },
        {
            question: "¿Cuál es la derivada de \\( f(x) = e^x \\)?",
            options: ["\\( x e^{x-1} \\)", "\\( e^x \\)", "\\( \\ln(x) \\)", "\\( 0 \\)"],
            correctIndex: 1,
            feedback: "¡Perfecto! La función exponencial natural es especial porque su derivada es ella misma."
        },
        {
            question: "¿Cuál es la derivada de \\( f(x) = x^2 \\ln(x) \\)?",
            options: ["\\( 2x \\ln(x) \\)", "\\( x(2\\ln(x) + 1) \\)", "\\( 2x + \\frac{1}{x} \\)", "\\( x^2 \\ln(x) + 2x \\)"],
            correctIndex: 1,
            feedback: "¡Correcto! Usamos la regla del producto: \\( (u \\cdot v)' = u'v + uv' \\). Si \\( u = x^2 \\) y \\( v = \\ln(x) \\), entonces \\( f'(x) = 2x \\ln(x) + x^2 \\left(\\frac{1}{x}\\right) = 2x \\ln(x) + x = x(2\\ln(x) + 1) \\)."
        },
        {
            question: "Aplica la regla del cociente: ¿Cuál es la derivada de \\( f(x) = \\frac{x^2 - 1}{x + 2} \\)?",
            options: ["\\( \\frac{x^2 + 4x - 1}{(x + 2)^2} \\)", "\\( 2x \\)", "\\( \\frac{x^2 + 4x + 1}{(x + 2)^2} \\)", "\\( \\frac{3x^2 + 4x - 1}{(x + 2)^2} \\)"],
            correctIndex: 2,
            feedback: "¡Excelente! Aplicando la regla del cociente \\( \\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2} \\): \\( f'(x) = \\frac{2x(x+2) - (x^2-1)(1)}{(x+2)^2} = \\frac{2x^2+4x-x^2+1}{(x+2)^2} = \\frac{x^2+4x+1}{(x+2)^2} \\)."
        },
        {
            question: "Aplica la regla de la cadena: ¿Cuál es la derivada de \\( f(x) = \\cos(x^2) \\)?",
            options: ["\\( -\\sin(2x) \\)", "\\( 2x \\cos(x^2) \\)", "\\( -\\sin(x^2) \\)", "\\( -2x \\sin(x^2) \\)"],
            correctIndex: 3,
            feedback: "¡Muy bien! Usamos la regla de la cadena: la derivada externa de la función coseno es \\( -\\sin(x^2) \\), y la multiplicamos por la derivada del argumento interno \\( x^2 \\), que es \\( 2x \\), resultando en \\( -2x \\sin(x^2) \\)."
        },
        {
            question: "¿Cuál es la derivada de \\( f(x) = \\ln(x^2 + 3) \\)?",
            options: ["\\( \\frac{1}{x^2 + 3} \\)", "\\( \\frac{2x}{x^2 + 3} \\)", "\\( \\frac{2x}{x} \\)", "\\( 2x \\ln(x^2 + 3) \\)"],
            correctIndex: 1,
            feedback: "¡Correcto! Por la regla de la cadena, la derivada de \\( \\ln(g(x)) \\) es \\( \\frac{g'(x)}{g(x)} \\). Aquí, \\( g(x) = x^2 + 3 \\) y \\( g'(x) = 2x \\), por lo que obtenemos \\( \\frac{2x}{x^2 + 3} \\)."
        },
        {
            question: "[Nivel Avanzado] Encuentra la derivada de \\( f(x) = \\ln\\left(\\frac{e^x}{x^2 + 1}\\right) \\).",
            options: ["\\( \\frac{x^2 - 1}{x^2 + 1} \\)", "\\( \\frac{e^x(x^2 - 2x + 1)}{x^2 + 1} \\)", "\\( 1 - \\frac{1}{x^2 + 1} \\)", "\\( \\frac{(x - 1)^2}{x^2 + 1} \\)"],
            correctIndex: 3,
            feedback: "¡Impresionante! Has resuelto la pregunta más difícil del quiz. La mejor forma de abordar esta derivada es simplificar primero usando las propiedades de los logaritmos: \\( f(x) = \\ln\\left(\\frac{e^x}{x^2 + 1}\\right) = \\ln(e^x) - \\ln(x^2 + 1) = x - \\ln(x^2 + 1) \\). Al derivar término a término obtenemos: \\( f'(x) = 1 - \\frac{2x}{x^2 + 1} \\). Al juntar las fracciones con denominador común: \\( f'(x) = \\frac{x^2 + 1 - 2x}{x^2 + 1} = \\frac{(x - 1)^2}{x^2 + 1} \\)."
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;

    function loadQuestion() {
        answered = false;
        const currentQuiz = quizData[currentQuestionIndex];
        
        // 1. Actualizar Rastreador y Barra de Progreso
        questionTracker.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizData.length}`;
        progressBar.style.width = `${((currentQuestionIndex) / quizData.length) * 100}%`;
        
        // 2. Inyectar Texto de la Pregunta
        questionText.innerHTML = currentQuiz.question;
        
        // 3. Limpiar Opciones y Feedback Anteriores
        optionsContainer.innerHTML = '';
        feedbackContainer.className = 'feedback-box hidden';
        feedbackContainer.innerHTML = '';
        nextBtnContainer.classList.add('hidden');

        // 4. Generar Botones de Opciones
        currentQuiz.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerHTML = option;
            button.onclick = () => selectOption(button, index);
            optionsContainer.appendChild(button);
        });

        // 5. Renderizar MathJax para las nuevas fórmulas inyectadas
        if (window.MathJax) {
            MathJax.typesetPromise([document.getElementById('question-container')]).catch((err) => console.log(err));
        }
    }

    function selectOption(selectedButton, index) {
        if (answered) return; // Bloquear clics múltiples
        answered = true;

        const currentQuiz = quizData[currentQuestionIndex];
        const isCorrect = (index === currentQuiz.correctIndex);
        
        const allButtons = optionsContainer.querySelectorAll('.option-btn');
        
        if (isCorrect) {
            selectedButton.classList.add('correct');
            score++;
            showFeedback('success', currentQuiz.feedback);
        } else {
            selectedButton.classList.add('incorrect');
            // Revelar cuál era la respuesta correcta
            allButtons[currentQuiz.correctIndex].classList.add('correct');
            showFeedback('error', "Incorrecto. " + currentQuiz.feedback);
        }

        // Desactivar todos los botones visualmente
        allButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'default';
        });
        
        // Mostrar el botón para avanzar
        nextBtnContainer.classList.remove('hidden');
    }

    function showFeedback(type, text) {
        feedbackContainer.className = `feedback-box ${type}`;
        feedbackContainer.innerHTML = text;
        
        // Renderizar si el feedback contiene fórmulas
        if (window.MathJax) {
            MathJax.typesetPromise([feedbackContainer]).catch((err) => console.log(err));
        }
    }

    function showResults() {
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        
        // Llenar barra al 100%
        progressBar.style.width = '100%';
        
        // Mostrar Score
        finalScoreDisplay.textContent = `${score}/${quizData.length}`;
        
        // Mensaje Personalizado
        if (score === quizData.length) {
            resultMessage.innerHTML = "¡Eres un maestro de las derivadas! 🏆<br>Puntaje Perfecto.";
        } else if (score >= 7) {
            resultMessage.innerHTML = "¡Muy buen trabajo! Tienes bases sólidas. 👍";
        } else {
            resultMessage.innerHTML = "Sigue practicando, repasa el <a href='formulario.html' class='text-primary'>Formulario</a> y vuelve a intentarlo. 📚";
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

    // Iniciar el examen con la primera pregunta
    loadQuestion();
});
