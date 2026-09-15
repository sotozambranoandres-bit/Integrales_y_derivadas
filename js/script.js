// ==========================================================================
// SCRIPT PRINCIPAL: CÁLCULO INTEGRAL & EDO VARIABLES SEPARABLES
// ==========================================================================

// 1. Animaciones de aparición suave al hacer scroll (Fade-in)
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
});

// 2. Botones de Mostrar/Ocultar Solución
function toggleSolution(id) {
    const container = document.getElementById(id);
    if (!container) return;
    const button = container.previousElementSibling; 

    if (container.classList.contains('show')) {
        container.classList.remove('show');
        if (button) button.innerHTML = '👁️ Mostrar Solución';
    } else {
        container.classList.add('show');
        if (button) button.innerHTML = '🙈 Ocultar Solución';
        // Si hay fórmulas matemáticas en la solución, asegurar renderizado de MathJax
        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([container]).catch(err => console.log(err));
        }
    }
}

// 3. Menú Móvil Responsive (Hamburguesa)
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
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
// 4. SIMULADOR INTERACTIVO DE SUMATORIAS DE RIEMANN (HTML5 Canvas)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('riemannCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const funcSelect = document.getElementById('riemannFunc');
    const typeSelect = document.getElementById('riemannType');
    const nSlider = document.getElementById('riemannN');
    const nValSpan = document.getElementById('riemannNVal');
    const statRiemannSum = document.getElementById('statRiemannSum');
    const statExactArea = document.getElementById('statExactArea');
    const statError = document.getElementById('statError');

    // Definición de las funciones disponibles
    const functions = {
        x2: {
            name: "f(x) = x²",
            a: 0,
            b: 3,
            f: x => x * x,
            exact: 9.0, // integral de 0 a 3 de x^2 dx = [x^3/3]_0^3 = 9
            yMin: -0.5,
            yMax: 9.5
        },
        sin: {
            name: "f(x) = sin(x) + 1.2",
            a: 0,
            b: Math.PI,
            f: x => Math.sin(x) + 1.2,
            exact: 2 + 1.2 * Math.PI, // [-cos x + 1.2x]_0^pi = 2 + 1.2pi ≈ 5.7699
            yMin: -0.2,
            yMax: 2.5
        },
        parabola: {
            name: "f(x) = 4 - x²",
            a: -2,
            b: 2,
            f: x => 4 - x * x,
            exact: 32 / 3, // integral de -2 a 2 = 10.6667
            yMin: -1,
            yMax: 4.8
        },
        sqrt: {
            name: "f(x) = √(x + 1)",
            a: 0,
            b: 4,
            f: x => Math.sqrt(x + 1),
            exact: (2 / 3) * (Math.pow(5, 1.5) - 1), // ≈ 6.7869
            yMin: -0.2,
            yMax: 2.6
        }
    };

    function drawSimulator() {
        const key = funcSelect.value;
        const config = functions[key] || functions.x2;
        const method = typeSelect.value;
        const n = parseInt(nSlider.value, 10);
        nValSpan.textContent = n;

        // Ajustar resolución retina para que se vea ultra nítido
        const width = canvas.clientWidth || 760;
        const height = canvas.clientHeight || 340;
        const dpr = window.devicePixelRatio || 1;

        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        // Márgenes del plano cartesiano
        const padLeft = 55;
        const padRight = 30;
        const padTop = 30;
        const padBottom = 40;
        const plotW = width - padLeft - padRight;
        const plotH = height - padTop - padBottom;

        const xMin = config.a - (config.b - config.a) * 0.1;
        const xMax = config.b + (config.b - config.a) * 0.1;
        const yMin = config.yMin;
        const yMax = config.yMax;

        const toCanvasX = x => padLeft + ((x - xMin) / (xMax - xMin)) * plotW;
        const toCanvasY = y => padTop + (1 - (y - yMin) / (yMax - yMin)) * plotH;

        // 1. Cuadrícula sutil de fondo
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
            ctx.beginPath();
            ctx.moveTo(toCanvasX(x), padTop);
            ctx.lineTo(toCanvasX(x), padTop + plotH);
            ctx.stroke();
        }
        for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
            ctx.beginPath();
            ctx.moveTo(padLeft, toCanvasY(y));
            ctx.lineTo(padLeft + plotW, toCanvasY(y));
            ctx.stroke();
        }

        // 2. Ejes coordenados X e Y
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1.5;
        // Eje X (y = 0)
        if (yMin <= 0 && yMax >= 0) {
            const y0 = toCanvasY(0);
            ctx.beginPath();
            ctx.moveTo(padLeft, y0);
            ctx.lineTo(padLeft + plotW, y0);
            ctx.stroke();
        }
        // Eje Y (x = 0)
        if (xMin <= 0 && xMax >= 0) {
            const x0 = toCanvasX(0);
            ctx.beginPath();
            ctx.moveTo(x0, padTop);
            ctx.lineTo(x0, padTop + plotH);
            ctx.stroke();
        }

        // 3. Calcular Suma de Riemann y dibujar rectángulos
        const a = config.a;
        const b = config.b;
        const dx = (b - a) / n;
        let sum = 0;

        for (let i = 0; i < n; i++) {
            const xLeft = a + i * dx;
            const xRight = a + (i + 1) * dx;
            let xSample;

            if (method === 'left') {
                xSample = xLeft;
            } else if (method === 'right') {
                xSample = xRight;
            } else {
                xSample = (xLeft + xRight) / 2; // Midpoint
            }

            const yVal = config.f(xSample);
            sum += yVal * dx;

            const rx = toCanvasX(xLeft);
            const rw = toCanvasX(xRight) - rx;
            const ry = toCanvasY(Math.max(0, yVal));
            const yZero = toCanvasY(0);
            const rh = Math.abs(yZero - ry);

            // Relleno de rectángulo con gradiente translúcido
            ctx.fillStyle = "rgba(74, 222, 128, 0.22)";
            ctx.fillRect(rx, Math.min(yZero, ry), rw, rh);

            // Borde del rectángulo
            ctx.strokeStyle = "rgba(74, 222, 128, 0.75)";
            ctx.lineWidth = 1.2;
            ctx.strokeRect(rx, Math.min(yZero, ry), rw, rh);

            // Punto muestreado (x*, f(x*))
            ctx.fillStyle = "#4ade80";
            ctx.beginPath();
            ctx.arc(toCanvasX(xSample), toCanvasY(yVal), 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // 4. Dibujar la curva suave de la función f(x)
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "rgba(74, 222, 128, 0.6)";
        ctx.shadowBlur = 8;

        const steps = 200;
        for (let i = 0; i <= steps; i++) {
            const curX = xMin + (i / steps) * (xMax - xMin);
            const curY = config.f(curX);
            const cx = toCanvasX(curX);
            const cy = toCanvasY(curY);
            if (i === 0) {
                ctx.moveTo(cx, cy);
            } else {
                ctx.lineTo(cx, cy);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // 5. Etiquetas de ejes y valores
        ctx.fillStyle = "#a0a0a0";
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "center";

        // Marcadores de límites de integración [a, b]
        ctx.fillStyle = "#4ade80";
        ctx.fillText(`a = ${a.toFixed(1)}`, toCanvasX(a), toCanvasY(0) + 18);
        ctx.fillText(`b = ${b.toFixed(1)}`, toCanvasX(b), toCanvasY(0) + 18);

        // Líneas verticales punteadas en a y b
        ctx.strokeStyle = "rgba(74, 222, 128, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toCanvasX(a), padTop);
        ctx.lineTo(toCanvasX(a), toCanvasY(0));
        ctx.moveTo(toCanvasX(b), padTop);
        ctx.lineTo(toCanvasX(b), toCanvasY(0));
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();

        // Actualizar estadísticas numéricas
        const exact = config.exact;
        const err = Math.abs((sum - exact) / exact) * 100;

        statRiemannSum.textContent = sum.toFixed(4);
        statExactArea.textContent = exact.toFixed(4);
        statError.textContent = err.toFixed(2) + "%";
    }

    // Escuchadores de eventos para interactividad inmediata
    funcSelect.addEventListener('change', drawSimulator);
    typeSelect.addEventListener('change', drawSimulator);
    nSlider.addEventListener('input', drawSimulator);
    window.addEventListener('resize', drawSimulator);

    // Dibujo inicial
    drawSimulator();
});

// ==========================================================================
// 5. QUIZ INTERACTIVO EXPANDIDO (CÁLCULO INTEGRAL & EDOs)
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

    // Base de datos exhaustiva cubriendo todos los temas de la pizarra
    const quizData = [
        {
            question: "¿Qué expresa la segunda parte del Teorema Fundamental del Cálculo (Regla de Barrow)?",
            options: [
                "\\( \\int_a^b f(x)\\,dx = F(b) - F(a) \\)",
                "\\( \\frac{d}{dx}[f(x)] = F(x) \\)",
                "\\( \\int_a^b f(x)\\,dx = f'(b) - f'(a) \\)",
                "\\( \\int f(x)\\,dx = x \\cdot f(x) + C \\)"
            ],
            correctIndex: 0,
            feedback: "La regla de Barrow establece que la integral definida de \\( f(x) \\) es la diferencia entre su antiderivada evaluada en el límite superior e inferior: \\( F(b) - F(a) \\)."
        },
        {
            question: "¿Qué representa geométricamente la Sumatoria de Riemann cuando el número de particiones \\( n \\to \\infty \\)?",
            options: [
                "La longitud de arco de la curva",
                "El área exacta bajo la curva (la integral definida)",
                "La pendiente de la recta tangente",
                "El volumen de una esfera circunscrita"
            ],
            correctIndex: 1,
            feedback: "Al tomar el límite con \\( n \\to \\infty \\), el ancho de los rectángulos tiende a cero y la sumatoria converge al área exacta bajo la curva."
        },
        {
            question: "Para calcular el área acotada entre dos curvas donde \\( f(x) \\ge g(x) \\) en \\( [a, b] \\), la fórmula es:",
            options: [
                "\\( \\int_a^b [f(x) + g(x)]\\,dx \\)",
                "\\( \\int_a^b [f(x) - g(x)]\\,dx \\)",
                "\\( \\int_a^b [f(x) \\cdot g(x)]\\,dx \\)",
                "\\( \\frac{\\int_a^b f(x)\\,dx}{\\int_a^b g(x)\\,dx} \\)"
            ],
            correctIndex: 1,
            feedback: "El área entre dos curvas siempre se calcula como la integral de la 'función superior' menos la 'función inferior' en el intervalo dado."
        },
        {
            question: "Según la regla mnemotécnica <strong>ILATE</strong>, ¿cuál debe ser la elección de \\( u \\) en la integral \\( \\int x \\ln(x)\\,dx \\)?",
            options: [
                "\\( u = x \\) (Algebraica)",
                "\\( u = \\ln(x) \\) (Logarítmica)",
                "\\( u = x \\ln(x) \\)",
                "\\( u = dx \\)"
            ],
            correctIndex: 1,
            feedback: "En ILATE, las funciones Logarítmicas (L) tienen prioridad sobre las Algebraicas (A); por tanto, \\( u = \\ln(x) \\) y \\( dv = x\\,dx \\)."
        },
        {
            question: "Para resolver una integral con la expresión \\( \\sqrt{16 - x^2} \\), ¿cuál es la sustitución trigonométrica recomendada?",
            options: [
                "\\( x = 16\\sin(\\theta) \\)",
                "\\( x = 4\\tan(\\theta) \\)",
                "\\( x = 4\\sin(\\theta) \\)",
                "\\( x = 4\\sec(\\theta) \\)"
            ],
            correctIndex: 2,
            feedback: "La forma \\( \\sqrt{a^2 - x^2} \\) corresponde al Caso 1 con \\( a = 4 \\), por lo que \\( x = 4\\sin(\\theta) \\), aprovechando \\( 1 - \\sin^2(\\theta) = \\cos^2(\\theta) \\)."
        },
        {
            question: "¿Cuál es la forma correcta de descomponer en fracciones parciales \\( \\frac{3x + 1}{(x - 2)(x + 5)} \\)?",
            options: [
                "\\( \\frac{A}{x - 2} + \\frac{B}{x + 5} \\)",
                "\\( \\frac{Ax + B}{(x - 2)(x + 5)} \\)",
                "\\( \\frac{A}{(x - 2)^2} + \\frac{B}{x + 5} \\)",
                "\\( \\frac{A}{x - 2} \\cdot \\frac{B}{x + 5} \\)"
            ],
            correctIndex: 0,
            feedback: "Al tratarse de dos factores lineales distintos, a cada uno le corresponde una constante independiente en el numerador: \\( \\frac{A}{x - 2} + \\frac{B}{x + 5} \\)."
        },
        {
            question: "¿Cuál es el primer paso para resolver la EDO \\( \\frac{dy}{dx} = 4x y \\)?",
            options: [
                "Derivar ambos lados respecto a \\( x \\)",
                "Separar variables: \\( \\frac{1}{y}\\,dy = 4x\\,dx \\)",
                "Hacer \\( y = 0 \\)",
                "Calcular la transformada de Laplace"
            ],
            correctIndex: 1,
            feedback: "Es una EDO de variables separables: agrupamos los términos con \\( y \\) con el diferencial \\( dy \\) y los términos con \\( x \\) con \\( dx \\) para poder integrar ambos lados."
        },
        {
            question: "¿Cuál es la integral directa de \\( f(x) = e^{3x} \\)?",
            options: [
                "\\( 3e^{3x} + C \\)",
                "\\( \\frac{1}{3}e^{3x} + C \\)",
                "\\( e^{3x} + C \\)",
                "\\( e^{3x+1} + C \\)"
            ],
            correctIndex: 1,
            feedback: "Por la regla de integración de exponenciales \\( \\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C \\), el resultado es \\( \\frac{1}{3}e^{3x} + C \\)."
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

        currentQuiz.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = opt;
            btn.onclick = () => selectOption(btn, idx);
            optionsContainer.appendChild(btn);
        });

        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([quizContainer]).catch(err => console.log(err));
        }
    }

    function selectOption(btn, idx) {
        if (answered) return;
        answered = true;

        const currentQuiz = quizData[currentQuestionIndex];
        const isCorrect = (idx === currentQuiz.correctIndex);
        const allButtons = optionsContainer.querySelectorAll('.option-btn');

        if (isCorrect) {
            btn.classList.add('correct');
            score++;
            showFeedback('success', "¡Excelente! " + currentQuiz.feedback);
        } else {
            btn.classList.add('incorrect');
            allButtons[currentQuiz.correctIndex].classList.add('correct');
            showFeedback('error', "Incorrecto. " + currentQuiz.feedback);
        }

        allButtons.forEach(b => {
            b.disabled = true;
            b.style.cursor = 'default';
        });

        nextBtnContainer.classList.remove('hidden');
    }

    function showFeedback(type, text) {
        feedbackContainer.className = `feedback-box ${type}`;
        feedbackContainer.innerHTML = text;

        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([feedbackContainer]).catch(err => console.log(err));
        }
    }

    function showResults() {
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        progressBar.style.width = '100%';

        finalScoreDisplay.textContent = `${score}/${quizData.length}`;

        if (score === quizData.length) {
            resultMessage.innerHTML = "¡Puntaje Perfecto! 🏆<br>Dominas todos los conceptos de cálculo integral y ecuaciones diferenciales.";
        } else if (score >= 5) {
            resultMessage.innerHTML = "¡Muy buen rendimiento! 👍<br>Tienes bases muy sólidas en los métodos del curso.";
        } else {
            resultMessage.innerHTML = "Sigue practicando 📚<br>Repasa los métodos de sustitución, partes, fracciones parciales y EDOs en la guía y vuelve a intentarlo.";
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
