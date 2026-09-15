# Portal Educativo Universitario: Cálculo Diferencial y Cálculo Integral

Una plataforma web interactiva y completa diseñada para estudiantes universitarios, que abarca los fundamentos teóricos, métodos analíticos paso a paso, hojas de fórmulas imprimibles, simuladores interactivos en tiempo real y evaluaciones formativas de autoevaluación.

---

## Estructura del Proyecto

```
├── index.html                   # Portal Principal: Cálculo Integral & EDO Variables Separables
├── css/
│   └── styles.css               # Estilos modernos (Tema Verde Esmeralda)
├── js/
│   └── script.js                # Simulador de Riemann en Canvas & Quiz interactivo
├── html/
│   ├── formulario.html          # Formulario completo de integrales
│   └── quiz.html                # Quiz interactivo de integrales
├── img/                         # Recursos visuales del módulo de integrales
│
└── derivadas/                   # Módulo Completo: Cálculo Diferencial (Derivadas)
    ├── index.html               # Guía completa de propiedades y reglas de derivadas
    ├── css/
    │   └── styles.css           # Estilos modernos (Tema Azul Eléctrico)
    ├── js/
    │   └── script.js            # Lógica interactiva de derivadas
    ├── html/
    │   ├── formulario.html      # Formulario imprimible de derivadas
    │   ├── quiz.html            # Examen interactivo de derivadas
    │   └── trigonometria.html   # Guía de derivadas trigonométricas e inversas
    └── img/                     # Recursos visuales del módulo de derivadas
```

---

## Módulo 1: Cálculo Integral y EDO
- **Definición de la Integral:** Antiderivada general, constante \(C\), integral definida y Teorema Fundamental del Cálculo (Partes 1 y 2 / Regla de Barrow).
- **Sumatorias de Riemann:** Simulador interactivo en HTML5 Canvas (extremo izquierdo, derecho y punto medio con cálculo de error en tiempo real).
- **Área Bajo la Curva:** Regiones sobre el eje \(x\), valor absoluto y área acotada entre dos curvas.
- **Propiedades de la Integral:** Linealidad, inversión de límites, aditividad de intervalos y acotamiento.
- **Integrales Directas:** Regla de la potencia, exponencial, logaritmo y trigonométricas inmediatas.
- **Métodos de Integración:**
  - Sustitución y Cambio de Variable
  - Integración por Partes (con mnemotecnia ILATE)
  - Sustitución Trigonométrica (los 3 casos canónicos y triángulos rectángulos)
  - Descomposición en Fracciones Parciales
- **Ecuaciones Diferenciales Ordinarias (EDO):** Variables separables y problemas de valor inicial (PVI).
- **Taller de Ejercicios:** Ejercicios combinados con soluciones paso a paso desplegables.

---

## Módulo 2: Cálculo Diferencial (Derivadas)
- **Definición Formal:** Concepto de límite de Fermat/Leibniz e interpretación geométrica como pendiente de la recta tangente.
- **Reglas Básicas:** Derivada de una constante, regla de la potencia y múltiplos escalares.
- **Operaciones de Derivación:** Regla de la suma/resta, regla del producto y regla del cociente.
- **Regla de la Cadena:** Composición de funciones y diferenciación paso a paso.
- **Funciones Trascendentes:** Exponenciales y logaritmos.
- **Derivadas Trigonométricas:** Seno, coseno, tangente, secante, cosecante, cotangente y funciones trigonométricas inversas.

---

## Cómo Ejecutar Localmente
Simplemente abre `index.html` en tu navegador web o inicia un servidor local:
```bash
# Con Python
python -m http.server 8080

# Con Node
npx http-server .
```
