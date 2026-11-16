import type { ActivityCategory, Course, Horizon, TopicKey, VerseQuizQuestion } from "../types";

export interface LifeArea {
  n: string;
  s: string;
  q: [string, string, string];
  r: string;
  c: string;
}

export const COL = [
  "#0E9488",
  "#D9527A",
  "#5B6FD6",
  "#C98A1B",
  "#3B82C4",
  "#8B7AC8",
  "#2E9E6B",
  "#D9683B",
  "#7BAE3A",
];

export const D: LifeArea[] = [
  {
    n: "Salud física",
    s: "Salud",
    q: [
      "Duermo lo suficiente y descanso bien",
      "Me muevo o hago ejercicio con regularidad",
      "Mi alimentación es equilibrada",
    ],
    r: "Elige un solo hábito de sueño, movimiento o alimentación y registra su cumplimiento durante 21 días.",
    c: COL[0],
  },
  {
    n: "Bienestar emocional",
    s: "Emoción",
    q: [
      "Suelo sentirme en calma y estable",
      "Reconozco y expreso lo que siento",
      "Me recupero con facilidad de los días difíciles",
    ],
    r: "Registra tu ánimo cada día y anota qué lo mueve. Si el malestar persiste, consulta a un profesional.",
    c: COL[1],
  },
  {
    n: "Desarrollo intelectual",
    s: "Mente",
    q: [
      "Aprendo algo nuevo con frecuencia",
      "Leo o estudio con regularidad",
      "Reflexiono antes de tomar decisiones",
    ],
    r: "Reserva 20 minutos diarios de lectura o estudio y conviértelos en un hábito.",
    c: COL[2],
  },
  {
    n: "Espiritualidad y propósito",
    s: "Espíritu",
    q: [
      "Siento que mi vida tiene dirección",
      "Dedico tiempo a lo que da sentido a mi vida",
      "Mis acciones reflejan mis valores",
    ],
    r: "Completa los ejercicios de Autoconocimiento (en Biblioteca) sobre valores y propósito, y define un objetivo alineado con ellos.",
    c: COL[3],
  },
  {
    n: "Familia y relaciones",
    s: "Familia",
    q: [
      "Dedico tiempo de calidad a mis seres queridos",
      "Me siento apoyado por mi entorno",
      "Resuelvo los conflictos con diálogo",
    ],
    r: "Agenda una tarea semanal concreta con una persona importante (llamada, visita o conversación).",
    c: COL[4],
  },
  {
    n: "Desarrollo profesional",
    s: "Carrera",
    q: [
      "Mi trabajo o estudio me motiva",
      "Desarrollo mis habilidades de forma deliberada",
      "Tengo claro mi siguiente paso profesional",
    ],
    r: "Define un objetivo a mediano plazo con etapas y fecha para tu siguiente paso profesional.",
    c: COL[5],
  },
  {
    n: "Finanzas personales",
    s: "Finanzas",
    q: [
      "Sé cuánto gano y cuánto gasto",
      "Ahorro de forma regular",
      "Tengo control sobre mis deudas",
    ],
    r: "Crea un objetivo medible de ahorro o de control de gastos y revísalo cada semana.",
    c: COL[6],
  },
  {
    n: "Organización y productividad",
    s: "Orden",
    q: [
      "Planifico mi semana con anticipación",
      "Cumplo lo que me propongo",
      "Gestiono bien mi tiempo y mis distracciones",
    ],
    r: "Usa Agenda: elige máximo 3 tareas prioritarias por día y revisa las atrasadas cada semana.",
    c: COL[7],
  },
  {
    n: "Recreación y crecimiento personal",
    s: "Ocio",
    q: [
      "Disfruto de pasatiempos con regularidad",
      "Descanso sin culpa",
      "Me doy espacio para experiencias nuevas",
    ],
    r: "Programa una actividad recreativa semanal como una tarea fija.",
    c: COL[8],
  },
];

export const REF: [string, string][] = [
  ["Fortalezas y debilidades", "¿En qué soy bueno y qué me cuesta? ¿Qué dicen las personas cercanas?"],
  ["Valores personales", "¿Qué es no negociable para mí? ¿Cuándo he sentido orgullo de mis decisiones?"],
  ["Motivaciones", "¿Qué me impulsa a actuar sin que me obliguen?"],
  ["Creencias limitantes", "¿Qué frases me digo que me frenan (“yo no puedo…”)? ¿Qué evidencia real las sostiene?"],
  ["Patrones de comportamiento", "¿Qué repito en situaciones de estrés, y qué resultado me da?"],
  ["Áreas que necesitan atención", "¿Qué área de mi vida estoy postergando?"],
  ["Propósito y dirección", "¿Qué quiero que sea cierto de mi vida dentro de 5 años?"],
];

export const ML = ["Muy mal", "Mal", "Regular", "Bien", "Muy bien"];
export const MOOD_COLORS = ["#5B6B8C", "#7A93C0", "#A7B4C6", "#E8B84A", "#F2994A"];
export const MOOD_ICONS = ["face1", "face2", "face3", "face4", "face5"] as const;
export const PR: Record<number, string> = { 1: "alta", 2: "media", 3: "baja" };
export const DN = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const WK = ["L", "M", "M", "J", "V", "S", "D"];
export const HZ: Record<Horizon, string> = { c: "Corto plazo", m: "Mediano plazo", l: "Largo plazo" };

export interface TopicInfo {
  t: string;
  icon: string;
  c: string;
  k: string[];
}

export const T: Record<TopicKey, TopicInfo> = {
  sleep: {
    t: "Sueño y salud",
    icon: "moon",
    c: "#5B7DB8",
    k: [
      "Mantén horarios de dormir y despertar parecidos, también los fines de semana.",
      "Reduce pantallas y luz intensa en la hora previa a dormir.",
      "Evita cafeína por la tarde y comidas muy pesadas de noche.",
      "Si llevas semanas durmiendo mal, consulta a un profesional de salud.",
    ],
  },
  lead: {
    t: "Liderazgo",
    icon: "users",
    c: "#C98A1B",
    k: [
      "Aclara qué resultado esperas y para cuándo.",
      "Escucha antes de proponer soluciones.",
      "Da retroalimentación específica y cercana al hecho.",
      "Delega el resultado, no cada paso.",
    ],
  },
  science: {
    t: "Hábitos y ciencia",
    icon: "flask",
    c: "#0E9488",
    k: [
      "Un estudio sobre hábitos (Lally et al., 2010) encontró que automatizar una conducta tardó en promedio unos 66 días, con gran variación entre personas.",
      "Las metas específicas y con fecha suelen cumplirse más que las vagas.",
      "Atar un hábito nuevo a uno existente (“después de cenar, camino 10 minutos”) ayuda a sostenerlo.",
      "Fallar un día no borra el progreso: retoma al siguiente.",
    ],
  },
  stress: {
    t: "Manejo del estrés",
    icon: "wave",
    c: "#D9683B",
    k: [
      "Identifica qué situaciones lo disparan con tu registro de ánimo.",
      "Una respiración lenta, con exhalación más larga que la inhalación, suele bajar la activación en minutos.",
      "Divide lo que te abruma en la siguiente acción pequeña.",
      "Si el estrés interfiere con tu día a día, busca apoyo profesional.",
    ],
  },
  med: {
    t: "Meditación y calma",
    icon: "lotus",
    c: "#8B7AC8",
    k: [
      "Siéntate cómodo y cierra los ojos.",
      "Inhala 4 segundos por la nariz.",
      "Exhala 6 segundos por la boca.",
      "Repite 3 minutos. Si la mente se va, vuelve a contar sin juzgarte.",
    ],
  },
  self: {
    t: "Autoconocimiento",
    icon: "self",
    c: "#3B82C4",
    k: [],
  },
};

export const DT: TopicKey[] = ["sleep", "stress", "science", "self", "self", "lead", "science", "science", "med"];
export const TD: Record<TopicKey, number> = { sleep: 0, lead: 5, science: 7, stress: 1, med: 1, self: 3 };

export const BASE_COURSES: Course[] = [
  {
    id: "vida101",
    tp: "sleep",
    t: "Cuerpo y mente: fundamentos de una vida sana",
    d: "Descubre los pilares de la salud física y mental y cómo construir hábitos duraderos.",
    L: [
      [
        "¿Qué significa estar saludable?",
        "La salud no es solo la ausencia de enfermedad: incluye el bienestar físico, mental y social. Cuatro pilares influyen en casi todo lo demás: la alimentación, el movimiento, el sueño y el cuidado de tu mente. Están conectados: dormir mal suele aumentar el estrés, y el estrés cambia lo que comes. Evalúa cómo estás en cada uno sin juzgarte y elige solo uno para mejorar primero.",
      ],
      [
        "El papel de la alimentación",
        "No necesitas una dieta perfecta. Las guías generales de salud coinciden en priorizar alimentos poco procesados (verduras, frutas, legumbres, cereales integrales, proteínas variadas) y limitar azúcares añadidos y ultraprocesados. Un cambio pequeño y sostenible, como añadir una verdura a la cena, vale más que un plan estricto que abandonas en una semana. Si tienes una condición médica, consulta a un profesional antes de cambiar tu dieta.",
      ],
      [
        "Moverte: por qué importa y cómo encontrar lo tuyo",
        "La OMS recomienda a los adultos entre 150 y 300 minutos semanales de actividad aeróbica moderada, más ejercicios de fuerza al menos dos días a la semana. La mejor actividad es la que realmente haces: caminar, bailar, bicicleta, deporte. Empieza con 10 minutos y conviértelo en un hábito desde el botón +.",
      ],
      [
        "Cuidar tu mente",
        "La salud mental también se entrena: registra tu estado de ánimo, mantén vínculos con personas de confianza, reserva tiempo de descanso y pide ayuda cuando el malestar sea intenso o dure semanas. Esta app es psicoeducativa y no reemplaza la atención profesional. Consultar a un psicólogo o a un médico es una señal de cuidado.",
      ],
    ],
  },
  {
    id: "sueno",
    tp: "sleep",
    t: "Mejor sueño: guía práctica",
    d: "Rutinas y técnicas para dormir mejor, basadas en las recomendaciones habituales de la medicina del sueño.",
    L: [
      [
        "Cuántas horas necesitas",
        "La mayoría de los adultos necesita entre 7 y 9 horas, según las sociedades médicas del sueño, con variación individual. Una buena señal es despertar descansado y funcionar bien de día sin depender de la cafeína. Calcula tu hora de dormir contando hacia atrás desde la hora en que debes levantarte.",
      ],
      [
        "Horarios regulares",
        "El reloj biológico responde a la regularidad. Acostarte y levantarte a horas parecidas, incluso en fin de semana, ayuda a dormirte antes y mejor. La luz natural por la mañana refuerza ese ritmo. Elige una hora fija para levantarte y mantenla durante una semana.",
      ],
      [
        "Tu dormitorio",
        "Un cuarto oscuro, silencioso y fresco favorece el sueño. Reserva la cama para dormir y descansar, no para trabajar. Si no te duermes en unos 20 minutos, levántate, haz algo tranquilo con poca luz y vuelve cuando tengas sueño.",
      ],
      [
        "Qué evitar por la noche",
        "La cafeína puede afectar el sueño horas después de tomarla: evítala desde la tarde. El alcohol puede adormecerte, pero fragmenta el sueño. Las pantallas y la luz intensa en la hora previa pueden retrasar el sueño: cambia el celular por una lectura ligera.",
      ],
      [
        "Calmar la mente antes de dormir",
        "Si los pensamientos te mantienen despierto, escribe diez minutos antes de acostarte lo pendiente y lo que te preocupa. Luego respira lento: inhala 4 segundos, exhala 6, durante 3 minutos. Si el insomnio dura más de unas semanas o afecta tu día, consulta a un profesional.",
      ],
    ],
  },
  {
    id: "liderazgo",
    tp: "lead",
    t: "Liderar con claridad",
    d: "Habilidades esenciales para guiar personas y equipos.",
    L: [
      [
        "Liderar empieza por ti",
        "Antes de guiar a otros, conoce tus valores, tus fortalezas y tus puntos ciegos. Pide retroalimentación a dos personas de confianza y compárala con tu autoevaluación. Un líder coherente hace lo que dice.",
      ],
      [
        "Comunicar con claridad",
        "Define el resultado esperado, el plazo y por qué importa. Confirma que te entendieron pidiendo que lo resuman con sus palabras. Una expectativa vaga produce resultados vagos.",
      ],
      [
        "Escuchar y dar retroalimentación",
        "Escucha sin interrumpir y pregunta antes de concluir. Al dar retroalimentación, describe el hecho observable, su impacto y propón un siguiente paso. Hazlo pronto y, si es una corrección, en privado.",
      ],
      [
        "Delegar y dar seguimiento",
        "Delega el resultado y deja que la otra persona elija el método. Acuerda puntos de revisión en lugar de supervisar cada paso. Reconoce los avances: lo que se reconoce tiende a repetirse.",
      ],
    ],
  },
  {
    id: "habitos",
    tp: "science",
    t: "Cómo se forman los hábitos",
    d: "Qué dice la investigación sobre cambiar conductas.",
    L: [
      [
        "Cuánto tarda un hábito",
        "Un estudio de Lally y colegas (2010) siguió a personas que adoptaron una conducta diaria y halló que automatizarla tardó en promedio 66 días, con un rango muy amplio (de 18 a 254 días). No existe un número mágico como “21 días”. Lo que cuenta es la repetición constante.",
      ],
      [
        "Metas específicas",
        "La investigación sobre fijación de metas (Locke y Latham) indica que las metas específicas y desafiantes, pero alcanzables, suelen mejorar el rendimiento más que las vagas. Convierte “ponerme en forma” en “caminar 30 minutos lunes, miércoles y viernes”.",
      ],
      [
        "Intenciones de implementación",
        "Formular un plan “si ocurre X, entonces hago Y” aumenta la probabilidad de actuar, según estudios de Peter Gollwitzer. Ejemplo: “después de cenar, camino 10 minutos”. Conecta tu hábito nuevo con algo que ya haces cada día.",
      ],
      [
        "Cuando fallas",
        "En el estudio de Lally, un olvido aislado no afectó de forma importante la formación del hábito. Un tropiezo no borra tu avance. Retoma al día siguiente y, si fallas seguido, reduce el hábito a su versión mínima.",
      ],
    ],
  },
  {
    id: "estres",
    tp: "stress",
    t: "Manejo del estrés",
    d: "Reconoce el estrés y practica herramientas sencillas.",
    L: [
      [
        "Qué es el estrés",
        "El estrés es la respuesta del cuerpo ante una demanda. En dosis cortas ayuda a rendir; sostenido puede afectar el sueño, el ánimo y la salud. Aprende a notar tus señales: tensión muscular, irritabilidad, mente acelerada.",
      ],
      [
        "Identifica tus disparadores",
        "Usa el registro de ánimo y anota las situaciones estresantes. Tras unas semanas verás patrones: personas, horarios, tareas. Distingue lo que puedes cambiar, lo que puedes influir y lo que debes aceptar.",
      ],
      [
        "Respiración y pausas",
        "Una exhalación más larga que la inhalación puede ayudar a calmar la activación del cuerpo. Prueba: inhala 4 segundos, exhala 6, durante tres minutos. Añade micropausas de uno o dos minutos entre tareas exigentes.",
      ],
      [
        "Cuándo pedir ayuda",
        "Busca apoyo profesional si el estrés o la ansiedad interfieren con tu trabajo, tus relaciones o tu sueño durante semanas. Si piensas en hacerte daño, contacta de inmediato a los servicios de emergencia de tu país o a una persona de confianza. Esta app no ofrece diagnóstico ni tratamiento.",
      ],
    ],
  },
  {
    id: "meditaciones",
    tp: "med",
    t: "Pausas guiadas",
    d: "Prácticas breves para calmar la mente.",
    L: [
      [
        "Respiración 4-6",
        "Siéntate cómodo y cierra los ojos.\nInhala 4 segundos por la nariz.\nExhala 6 segundos por la boca.\nRepite durante 3 minutos. Si la mente se va, vuelve a contar sin juzgarte.",
      ],
      [
        "Escaneo corporal",
        "Siéntate o acuéstate cómodo. Lleva la atención a los pies y sube despacio por piernas, abdomen, pecho, manos, hombros y rostro, unos 20 segundos en cada zona. Solo observa lo que sientes, sin intentar cambiarlo.",
      ],
      [
        "Atención a los sonidos",
        "Cierra los ojos y durante tres minutos escucha los sonidos a tu alrededor sin ponerles nombre ni juzgarlos. Cuando tu mente se vaya, vuelve al sonido más cercano.",
      ],
      [
        "Gratitud breve",
        "Antes de dormir, anota tres cosas concretas del día por las que estés agradecido. Algunos estudios asocian este ejercicio con mayor bienestar, aunque los efectos suelen ser modestos.",
      ],
    ],
  },
  {
    id: "conocete",
    tp: "self",
    t: "Conócete: guía de autoconocimiento",
    d: "Cuatro ejercicios para clarificar quién eres y hacia dónde vas.",
    L: [
      [
        "Tus valores",
        "Los valores son lo que consideras importante al decidir cómo vivir. Elige cinco (por ejemplo familia, honestidad, aprendizaje, libertad, servicio) y ordénalos. Compáralos con cómo usaste tu tiempo esta semana: las diferencias muestran dónde ajustar.",
      ],
      [
        "Fortalezas y puntos ciegos",
        "Anota tres cosas en las que otros suelen pedirte ayuda y tres en las que sueles postergar o fallar. Pregunta a dos personas cercanas cuál es tu mayor fortaleza. Usa las fortalezas en tus objetivos y diseña apoyos para tus puntos débiles.",
      ],
      [
        "Creencias limitantes",
        "Frases como “yo no puedo” o “siempre fallo” pueden frenarte. Escríbela y pregúntate: ¿qué evidencia real hay a favor y en contra? ¿Qué le diría a un amigo en mi lugar? Reformula una versión más precisa y útil.",
      ],
      [
        "Propósito y dirección",
        "Imagina tu vida dentro de cinco años y describe cómo quieres que sea en cada área de tu rueda de vida. Elige la que más te importa y conviértela en un objetivo con acciones concretas. Revisa esta guía cada trimestre.",
      ],
    ],
  },
];

export const ENR: Record<string, { r: string[]; a: { t: string; items: string[] } }> = {
  vida101: {
    r: [
      "¿En cuál de los cuatro pilares (alimentación, movimiento, sueño, mente) te sientes más débil hoy y por qué?",
      "¿Qué pequeño cambio en tu alimentación podrías sostener durante dos semanas?",
      "¿Qué actividad física disfrutas o te gustaría probar? ¿Cuándo podrías hacerla esta semana?",
      "¿Qué personas o hábitos te ayudan a cuidar tu mente? ¿Qué te falta?",
    ],
    a: {
      t: "Pasos para una vida más saludable",
      items: [
        "Elige un solo pilar para mejorar esta semana",
        "Añade una verdura a una comida",
        "Camina 10 minutos",
        "Anota cómo te sientes antes de dormir",
      ],
    },
  },
  sueno: {
    r: [
      "¿A qué hora te acuestas y te levantas normalmente? ¿Es estable?",
      "¿Qué hora fija de levantarte podrías mantener esta semana?",
      "¿Qué cambiarías de tu dormitorio para dormir mejor?",
      "¿Qué suele alterar tu sueño por la noche: cafeína, pantallas, preocupaciones?",
      "¿Qué te ayudaría a calmar la mente antes de dormir?",
    ],
    a: {
      t: "Pasos para dormir mejor",
      items: [
        "Fija una hora de levantarte y mantenla 7 días",
        "Deja el celular lejos de la cama una hora antes de dormir",
        "Escribe tus pendientes antes de acostarte",
        "Practica la respiración 4-6 durante 3 minutos",
      ],
    },
  },
  liderazgo: {
    r: [
      "¿Cuáles son tus dos mayores fortalezas y tu mayor punto ciego como líder?",
      "Piensa en una expectativa que diste: ¿era clara en resultado y plazo?",
      "¿Qué retroalimentación tienes pendiente con alguien?",
      "¿Qué podrías delegar esta semana y cómo acordarías el seguimiento?",
    ],
    a: {
      t: "Pasos para liderar mejor",
      items: [
        "Pide retroalimentación a dos personas de confianza",
        "Define por escrito el resultado y el plazo de una tarea",
        "Da una retroalimentación específica",
        "Delega una tarea acordando un punto de revisión",
      ],
    },
  },
  habitos: {
    r: [
      "¿Qué hábito quieres automatizar y por qué te importa?",
      "Reescribe tu meta de forma específica: ¿qué, cuánto y cuándo?",
      "Completa: “Después de ___, haré ___”.",
      "¿Qué harás si fallas un día? Define la versión mínima de tu hábito.",
    ],
    a: {
      t: "Pasos para consolidar un hábito",
      items: [
        "Escribe tu hábito con la frase “Después de…, haré…”",
        "Define su versión mínima",
        "Márcalo cada día en Hábitos durante una semana",
        "Revisa tu racha el viernes",
      ],
    },
  },
  estres: {
    r: [
      "¿Qué señales notas en tu cuerpo y en tu mente cuando estás estresado?",
      "¿Qué tres situaciones disparan más tu estrés?",
      "¿Cuándo podrías hacer una pausa breve de respiración durante el día?",
      "¿Con quién podrías hablar si el estrés aumenta?",
    ],
    a: {
      t: "Pasos para manejar el estrés",
      items: [
        "Registra tu ánimo cada día",
        "Haz la respiración 4-6 durante 3 minutos",
        "Programa dos micropausas de 2 minutos",
        "Conversa con alguien de confianza",
      ],
    },
  },
  meditaciones: {
    r: [
      "¿Cómo te sentiste antes y después de la respiración 4-6?",
      "¿Qué zona de tu cuerpo sentías más tensa en el escaneo?",
      "¿Qué sonidos notaste que normalmente ignoras?",
      "¿Por cuáles tres cosas concretas estás agradecido hoy?",
    ],
    a: {
      t: "Pasos para practicar la calma",
      items: [
        "Haz la respiración 4-6 por la mañana",
        "Haz un escaneo corporal antes de dormir",
        "Escribe tres agradecimientos esta noche",
      ],
    },
  },
  conocete: {
    r: [
      "Escribe tus cinco valores y ordénalos. ¿Cuál has descuidado esta semana?",
      "¿En qué te piden ayuda los demás? ¿Qué sueles postergar?",
      "¿Qué frase limitante te repites y qué evidencia real la contradice?",
      "¿Cómo quieres que sea tu vida dentro de cinco años?",
    ],
    a: {
      t: "Pasos para conocerte mejor",
      items: [
        "Escribe tus cinco valores principales",
        "Pregunta a dos personas cuál es tu mayor fortaleza",
        "Reformula una creencia limitante",
        "Crea un objetivo alineado con tus valores",
      ],
    },
  },
};

export interface SuggestedGoal {
  id: string;
  dim: number;
  t: string;
  weeks: number;
  d: string;
  ok: string;
  steps: { t: string; day?: number; f?: number }[];
}

export const PG: SuggestedGoal[] = [
  {
    id: "correr",
    dim: 0,
    t: "Comienza a correr",
    weeks: 6,
    d: "Un plan progresivo para pasar de caminar a trotar con regularidad sin lesionarte. Si tienes dudas sobre tu salud, consulta a un médico antes de empezar.",
    ok: "Puedes trotar 20 minutos seguidos",
    steps: [
      { t: "Consigue calzado cómodo y adecuado", day: 0 },
      { t: "Camina rápido 20 minutos", f: 3 },
      { t: "Alterna 1 minuto de trote suave y 2 de caminata, durante 20 minutos", f: 3 },
      { t: "Estira suavemente al terminar", f: 3 },
    ],
  },
  {
    id: "consciente",
    dim: 0,
    t: "Aprende a comer con conciencia",
    weeks: 3,
    d: "Practica comer con atención: sin pantallas, despacio y notando el hambre y la saciedad. Este objetivo crea poco a poco el hábito de comer con atención.",
    ok: "Comes sin pantallas al menos una vez al día durante la semana 3",
    steps: [
      { t: "Lee la lección “El papel de la alimentación” en Biblioteca", day: 0 },
      { t: "Come una comida al día sin pantallas", f: 7 },
      { t: "Mastica despacio y haz una pausa a mitad de la comida", f: 5 },
      { t: "Anota tu nivel de hambre (1 a 5) antes de comer", f: 5 },
    ],
  },
  {
    id: "saludable",
    dim: 0,
    t: "Come de forma más saludable",
    weeks: 4,
    d: "Pequeños cambios sostenibles en tu alimentación: más verduras, menos bebidas azucaradas y más comidas preparadas en casa.",
    ok: "Cumples al menos el 80% de las acciones semanales",
    steps: [
      { t: "Añade una porción de verduras a una comida", f: 7 },
      { t: "Cambia una bebida azucarada por agua", f: 5 },
      { t: "Planifica las compras de la semana", f: 1 },
      { t: "Prepara en casa tres comidas", f: 3 },
    ],
  },
  {
    id: "estres",
    dim: 1,
    t: "Reducir el estrés diario",
    weeks: 4,
    d: "Herramientas simples para notar y bajar el estrés. No sustituye la atención profesional si el malestar es intenso o persistente.",
    ok: "Tu estrés promedio semanal baja respecto a la semana 1",
    steps: [
      { t: "Respiración 4-6 durante 3 minutos", f: 7 },
      { t: "Registra tu ánimo y estrés", f: 7 },
      { t: "Haz una pausa de 2 minutos entre tareas exigentes", f: 5 },
      { t: "Conversa con alguien de confianza", f: 1 },
    ],
  },
  {
    id: "leer",
    dim: 2,
    t: "Crear el hábito de leer",
    weeks: 4,
    d: "Construye una rutina de lectura breve y constante.",
    ok: "Lees al menos 15 minutos, 5 días por semana",
    steps: [
      { t: "Elige el libro que leerás", day: 0 },
      { t: "Lee 15 minutos", f: 5 },
      { t: "Anota una idea de lo que leíste", f: 2 },
    ],
  },
  {
    id: "proposito",
    dim: 3,
    t: "Reflexionar sobre mi propósito",
    weeks: 4,
    d: "Un recorrido guiado para aclarar tus valores y la dirección que quieres darle a tu vida.",
    ok: "Defines un objetivo alineado con tus valores",
    steps: [
      { t: "Completa el curso “Conócete” en Biblioteca", day: 0 },
      { t: "Escribe tus cinco valores principales", day: 2 },
      { t: "Describe en el Cuaderno cómo quieres que sea tu vida en cinco años", day: 6 },
      { t: "Revisa lo escrito y crea un objetivo a partir de ello", day: 20 },
    ],
  },
  {
    id: "familia",
    dim: 4,
    t: "Fortalecer mi vínculo familiar",
    weeks: 4,
    d: "Dedica tiempo de calidad y expresa aprecio a tus seres queridos de forma regular.",
    ok: "Mantienes las tres acciones semanales durante 4 semanas",
    steps: [
      { t: "Llama o visita a un familiar", f: 2 },
      { t: "Comida familiar sin pantallas", f: 1 },
      { t: "Dile a alguien cercano algo que valoras de esa persona", f: 3 },
    ],
  },
  {
    id: "carrera",
    dim: 5,
    t: "Dar mi siguiente paso profesional",
    weeks: 8,
    d: "Define a dónde quieres llegar, identifica lo que te falta y avanza con acciones concretas.",
    ok: "Completas tu plan de formación y contactas a dos personas de tu campo",
    steps: [
      { t: "Define el puesto o meta profesional que quieres lograr", day: 0 },
      { t: "Lista las habilidades que te faltan", day: 3 },
      { t: "Dedica tiempo a formarte", f: 3 },
      { t: "Contacta a dos personas de tu campo", day: 30 },
    ],
  },
  {
    id: "ahorro",
    dim: 6,
    t: "Armar mi presupuesto y ahorrar",
    weeks: 4,
    d: "Conoce tus ingresos y gastos, y define un monto de ahorro realista.",
    ok: "Ahorras el monto que definiste este mes",
    steps: [
      { t: "Define cuánto ahorrarás este mes", day: 0 },
      { t: "Anota todos tus gastos", f: 7 },
      { t: "Revisa tu presupuesto", f: 1 },
    ],
  },
  {
    id: "semana",
    dim: 7,
    t: "Organizar mi semana",
    weeks: 3,
    d: "Un sistema sencillo para planificar la semana y enfocarte en lo importante.",
    ok: "Planificas la semana y revisas atrasadas cada semana",
    steps: [
      { t: "Planifica tu semana", f: 1 },
      { t: "Elige tus 3 prioridades del día", f: 5 },
      { t: "Revisa las tareas atrasadas", f: 1 },
    ],
  },
  {
    id: "ocio",
    dim: 8,
    t: "Más recreación en mi vida",
    weeks: 4,
    d: "Reserva tiempo para disfrutar, descansar y probar cosas nuevas.",
    ok: "Cumples una actividad recreativa por semana",
    steps: [
      { t: "Haz una actividad recreativa que disfrutes", f: 1 },
      { t: "Descansa 30 minutos sin culpa", f: 3 },
      { t: "Prueba algo nuevo", day: 14 },
    ],
  },
];

export const VS: [string, string][] = [
  ["Salmo 119:105", "La palabra de Dios es una lámpara que alumbra cada paso que doy y una luz para mi camino."],
  ["Proverbios 3:5-6", "Confía en el Señor con todo tu corazón, sin apoyarte solo en lo que tú entiendes. Tenlo presente en todo lo que hagas y él enderezará tus caminos."],
  ["Filipenses 4:6-7", "No vivas angustiado por nada: cuéntale a Dios lo que necesitas, con oración y gratitud, y su paz cuidará tu corazón y tus pensamientos."],
  ["Josué 1:9", "Sé fuerte y valiente. No te asustes ni te desanimes, porque el Señor tu Dios te acompaña a dondequiera que vayas."],
  ["Isaías 41:10", "No tengas miedo, porque estoy contigo. Yo te daré fuerzas, te ayudaré y te sostendré."],
  ["Mateo 6:33", "Pon primero el reino de Dios y su justicia; todo lo demás se te dará por añadidura."],
  ["Salmo 46:1", "Dios es nuestro refugio y nuestra fuerza, una ayuda siempre presente cuando llega la dificultad."],
  ["Colosenses 3:23", "Sea lo que sea que hagas, hazlo de corazón, como para el Señor y no solo para la gente."],
  ["Santiago 1:5", "Si te falta sabiduría, pídesela a Dios: él da con generosidad y sin reproches."],
  ["Mateo 11:28", "Si estás agotado o llevas una carga pesada, acércate a mí y yo te daré descanso."],
  ["1 Tesalonicenses 5:16-18", "Vive con alegría, ora continuamente y da gracias en toda circunstancia."],
  ["Gálatas 6:9", "No te canses de hacer el bien: si no te rindes, llegará el tiempo de la cosecha."],
  ["Salmo 23:1", "El Señor me cuida como un pastor; nada me faltará."],
  ["Romanos 12:2", "No copies las costumbres de este mundo; deja que Dios te transforme renovando tu manera de pensar."],
  ["Lamentaciones 3:22-23", "El amor del Señor no se agota y su compasión no tiene fin; se renuevan cada mañana."],
];

export interface VerseGuide {
  c: string;
  o: string[];
  i: string;
  a: string[];
  attitudes?: { pos: string[]; neg: string[] };
  q: string[];
  quiz?: VerseQuizQuestion[];
}

export const VX: Record<string, VerseGuide> = {
  "Salmo 119:105": {
    c: "Poema acróstico de 22 estrofas, una por letra del alfabeto hebreo, que celebra la palabra de Dios; el texto no nombra al autor.",
    o: [
      "Quien habla se dirige a Dios en primera persona: «tu palabra».",
      "Usa dos imágenes de luz: una lámpara para los pasos y una luz para el camino.",
      "La luz se atribuye a la palabra de Dios, no a las circunstancias.",
      "En todo el salmo se repiten términos equivalentes para la enseñanza de Dios (ley, palabra, mandamientos, testimonios).",
    ],
    i: "La palabra de Dios orienta la vida diaria. La imagen de la lámpara sugiere luz suficiente para el siguiente paso, más que una vista completa de todo el camino.",
    a: [
      "Antes de una decisión del día, leer un pasaje y preguntarte qué dice sobre esa situación.",
      "Cuando no ves el panorama completo, dar el siguiente paso que ya sabes que es correcto, en vez de esperar tenerlo todo claro.",
      "Cada semana anotar un pasaje que te guió y cómo lo aplicaste.",
    ],
    attitudes: {
      pos: [
        "Buscar guía en la palabra de Dios antes de decidir.",
        "Avanzar con fidelidad aun cuando solo ves el siguiente paso.",
      ],
      neg: [
        "Confiar únicamente en tu propio criterio sin consultar la Escritura.",
        "Quedarte paralizado por no tener todo el camino resuelto de antemano.",
      ],
    },
    q: [
      "¿Qué palabras usa el salmo para hablar de la palabra de Dios en los versículos cercanos?",
      "¿Qué diferencia hay entre una lámpara para los pasos y una luz que ilumina todo el camino?",
      "¿En qué área de tu vida te falta luz hoy?",
      "¿Qué pasaje te ha servido de guía en otro momento y qué pasó entonces?",
      "¿Qué hábito te ayudaría a leer la Biblia con más constancia?",
    ],
    quiz: [
      {
        q: "Según Salmo 119:105, ¿qué es «lámpara a mis pies» y «lumbrera a mi camino»?",
        opts: ["La opinión de la mayoría", "La palabra de Dios", "La fuerza propia"],
        ans: 1,
      },
      {
        q: "¿A quién se dirige en primera persona el autor en este versículo?",
        opts: ["A Dios", "Al rey de Israel", "A los escribas"],
        ans: 0,
      },
      {
        q: "¿Qué sugiere la imagen de una «lámpara para los pasos» frente al futuro?",
        opts: [
          "Que conocerás cada detalle de los próximos años",
          "Que la palabra de Dios da luz suficiente para el siguiente paso",
          "Que no habrá dificultades en el camino",
        ],
        ans: 1,
      },
      {
        q: "¿Qué tipo de poema es el Salmo 119 según su estructura literaria?",
        opts: [
          "Una parábola breve",
          "Un poema acróstico de 22 estrofas, una por letra del alfabeto hebreo",
          "Una carta de Pablo",
        ],
        ans: 1,
      },
      {
        q: "¿Qué aplicación práctica corresponde a momentos de incertidumbre?",
        opts: [
          "Esperar sin hacer nada hasta ver todo el panorama completo",
          "Dar el siguiente paso que ya sabes que es correcto a la luz de la Biblia",
          "Ignorar el consejo bíblico hasta tener certezas humanas",
        ],
        ans: 1,
      },
    ],
  },
  "Proverbios 3:5-6": {
    c: "Parte de una instrucción de un padre a su hijo (Prov. 1–9) dentro de un libro de sabiduría atribuido en su inicio a Salomón.",
    o: [
      "Dos mandatos positivos: confiar en el Señor con todo el corazón y reconocerlo en todos los caminos.",
      "Una prohibición: no apoyarse en el propio entendimiento.",
      "Una promesa: él enderezará las sendas.",
      "«Todo» el corazón y «todos» los caminos marcan un alcance total.",
    ],
    i: "La sabiduría empieza por confiar en Dios más que en la propia capacidad de entender. Reconocerlo en cada decisión es lo que da dirección; no anula el pensar, lo pone bajo esa confianza.",
    a: [
      "Antes de aceptar un trabajo, mudarte o hacer un gasto grande: orar, pedir consejo y revisar tus motivos.",
      "Cuando tengas dudas, hacer lo que está en tus manos y entregar el resultado a Dios.",
      "Reconocer a Dios también en decisiones pequeñas, como el trato que darás hoy a alguien.",
    ],
    attitudes: {
      pos: [
        "Confiar plenamente en Dios en cada decisión.",
        "Incluir a Dios en tus planes y caminos cotidianos.",
      ],
      neg: [
        "Apoyarte de forma autosuficiente solo en tu propio entendimiento.",
        "Dejar a Dios fuera de tus decisiones prácticas.",
      ],
    },
    q: [
      "¿Qué significa que sea con «todo» el corazón? ¿Dónde sueles confiar a medias?",
      "¿Qué diferencia hay entre pensar bien y apoyarse en el propio entendimiento?",
      "¿En qué decisión te estás apoyando solo en lo que entiendes?",
      "¿Cómo se ve en la práctica reconocer a Dios en tus caminos?",
      "¿Qué promete Dios aquí y qué te toca hacer a ti?",
    ],
    quiz: [
      {
        q: "¿Con qué medida pide Proverbios 3:5 confiar en el Señor?",
        opts: ["Con todo el corazón", "Solo en momentos de crisis", "Según lo que entiendas primero"],
        ans: 0,
      },
      {
        q: "¿En qué advierte Proverbios 3:5 que no debes apoyarte?",
        opts: ["En los consejos de tus padres", "En tu propio entendimiento", "En la oración diaria"],
        ans: 1,
      },
      {
        q: "¿Cuál es la promesa de Proverbios 3:6 para quienes reconocen a Dios en todos sus caminos?",
        opts: [
          "Que nunca cometerán errores",
          "Que él enderezará sus sendas",
          "Que tendrán riquezas materiales",
        ],
        ans: 1,
      },
      {
        q: "¿Cómo describe el contexto literario a Proverbios 1–9?",
        opts: [
          "Como una instrucción de un padre a su hijo dentro de un libro de sabiduría",
          "Como un discurso ante el sanedrín",
          "Como un himno de lamento por Jerusalén",
        ],
        ans: 0,
      },
      {
        q: "¿Qué relación hay entre pensar bien y no apoyarse en el propio entendimiento?",
        opts: [
          "La fe prohíbe razonar",
          "Pensar sigue siendo necesario, pero sujeto a la confianza en Dios",
          "La razón siempre reemplaza a la confianza",
        ],
        ans: 1,
      },
      {
        q: "¿Qué actitud positiva nace directamente de este pasaje?",
        opts: [
          "Incluir a Dios en tus planes y decisiones cotidianas",
          "Separar la fe de las decisiones laborales o económicas",
          "Confiar solo cuando ya conoces el resultado",
        ],
        ans: 0,
      },
    ],
  },
  "Filipenses 4:6-7": {
    c: "Carta de Pablo a la iglesia de Filipos, escrita estando él preso (Fil. 1:7, 13); aquí cierra con exhortaciones prácticas.",
    o: [
      "Un mandato: no estar afanosos por nada.",
      "La respuesta propuesta es la oración y la súplica, con acción de gracias, presentando las peticiones a Dios.",
      "Una promesa: la paz de Dios, que supera todo entendimiento, guardará los corazones y los pensamientos.",
      "Esa paz se sitúa «en Cristo Jesús» (v. 7).",
    ],
    i: "La ansiedad se enfrenta llevando cada preocupación a Dios con gratitud. La paz es lo que Dios da como resultado; no es algo que la persona fabrique por sí misma.",
    a: [
      "Cuando te preocupes por dinero, salud o un familiar: escribir la petición, orarla y añadir tres cosas por las que das gracias.",
      "En una noche con la mente llena de pendientes: anotarlos y entregarlos en oración antes de dormir.",
      "Antes de una conversación difícil: orar por la situación y por la otra persona.",
    ],
    attitudes: {
      pos: [
        "Llevar tus inquietudes a Dios en oración con un corazón agradecido.",
      ],
      neg: [
        "Alimentar el afán dándole vueltas a la preocupación sin entregarla a Dios.",
        "Olvidar la gratitud en medio de la necesidad.",
      ],
    },
    q: [
      "¿Qué diferencia hay entre presentar peticiones a Dios y afanarse?",
      "¿Por qué crees que Pablo incluye la acción de gracias?",
      "¿Qué significa que la paz «guarde» el corazón y la mente?",
      "¿Qué preocupación vas a poner en palabras ante Dios hoy?",
      "¿Qué puedes agradecer en medio de lo que te inquieta?",
    ],
    quiz: [
      {
        q: "¿Desde qué situación personal escribió Pablo la carta a los Filipenses?",
        opts: ["Estando preso", "Durante su juventud en Tarso", "En el templo de Jerusalén"],
        ans: 0,
      },
      {
        q: "Frente al afán y la preocupación, ¿qué exhorta a hacer el versículo 6?",
        opts: [
          "Guardar silencio hasta que pase el problema",
          "Presentar las peticiones a Dios en oración y súplica, con acción de gracias",
          "Resolverlo todo por cuenta propia",
        ],
        ans: 1,
      },
      {
        q: "¿Qué elemento acompaña a la oración y la súplica en Filipenses 4:6?",
        opts: ["La acción de gracias", "El ayuno prolongado", "El aislamiento"],
        ans: 0,
      },
      {
        q: "¿Qué promete el versículo 7 a quienes entregan sus inquietudes a Dios?",
        opts: [
          "La eliminación inmediata de todo problema",
          "Que la paz de Dios, que supera todo entendimiento, guardará sus corazones y pensamientos",
          "Un cambio automático de circunstancias",
        ],
        ans: 1,
      },
      {
        q: "¿Dónde se sitúa esa paz que guarda el corazón y la mente?",
        opts: ["En la fuerza de voluntad", "En Cristo Jesús", "En la ausencia de conflictos"],
        ans: 1,
      },
      {
        q: "¿Qué actitud negativa invita a evitar este pasaje?",
        opts: [
          "Alimentar el afán dándole vueltas a la preocupación sin presentarla a Dios",
          "Pedir ayuda en oración",
          "Agradecer por lo que ya tienes",
        ],
        ans: 0,
      },
    ],
  },
  "Josué 1:9": {
    c: "Dios comisiona a Josué para guiar a Israel hacia la tierra prometida tras la muerte de Moisés (Jos. 1:1-2).",
    o: [
      "Dios habla a Josué después de la muerte de Moisés.",
      "El mandato de ser fuerte y valiente se repite (vv. 6, 7 y 9).",
      "Una prohibición: no temer ni desmayar.",
      "La razón que se da: el Señor su Dios está con él dondequiera que vaya.",
    ],
    i: "La valentía que Dios pide se apoya en su presencia, no en la fuerza de la persona. El versículo 8 une esa valentía con meditar la ley y obedecerla.",
    a: [
      "Ante una conversación que temes (corregir a alguien, pedir perdón): dar el primer paso recordando que no estás solo.",
      "Ante un cambio grande (mudanza, nuevo trabajo): decidir qué paso concreto darás hoy.",
      "Hacer lo correcto aunque cueste, en el trabajo o en la familia.",
    ],
    attitudes: {
      pos: [
        "Actuar con valentía y firmeza apoyado en la presencia de Dios.",
      ],
      neg: [
        "Dejar que el miedo o el desánimo te hagan retroceder de lo que te corresponde hacer.",
      ],
    },
    q: [
      "¿Por qué crees que Dios repite «sé fuerte y valiente»?",
      "¿Qué razón da Dios para no temer?",
      "¿Qué relación ves entre la valentía de este versículo y el versículo 8?",
      "¿Qué situación te pide valentía hoy?",
      "¿Qué cambia en esa situación al recordar que Dios te acompaña?",
    ],
    quiz: [
      {
        q: "¿En qué momento histórico recibe Josué la comisión de Josué 1:9?",
        opts: [
          "Tras la muerte de Moisés, antes de guiar a Israel hacia la tierra prometida",
          "Después de construir el templo de Salomón",
          "Durante el regreso del exilio en Babilonia",
        ],
        ans: 0,
      },
      {
        q: "¿Qué mandato se repite varias veces en Josué 1 (vv. 6, 7 y 9)?",
        opts: ["Callar y esperar", "Ser fuerte y valiente", "Buscar alianzas militares"],
        ans: 1,
      },
      {
        q: "¿Cuál es la razón que da Dios en el versículo 9 para no temer ni desmayar?",
        opts: [
          "Que el ejército de Israel es invencible",
          "Que el Señor su Dios estará con él dondequiera que vaya",
          "Que el camino no tendrá enemigos",
        ],
        ans: 1,
      },
      {
        q: "Según el versículo 8 cercano, ¿con qué va unida la valentía que Dios pide?",
        opts: [
          "Con meditar la ley de Dios y obedecerla",
          "Con ignorar los riesgos",
          "Con depender de la propia fuerza física",
        ],
        ans: 0,
      },
      {
        q: "¿Cuál de estas actitudes refleja mejor la enseñanza de Josué 1:9?",
        opts: [
          "Avanzar con firmeza en lo correcto apoyado en la presencia de Dios",
          "Esperar a no sentir ningún miedo antes de obedecer",
          "Confiar solo en la propia capacidad",
        ],
        ans: 0,
      },
    ],
  },
  "Isaías 41:10": {
    c: "Mensaje de aliento de Dios a Israel dentro de la sección de Isaías 40–48 (aquí, 41:8-14).",
    o: [
      "Dios habla en primera persona: «yo estoy contigo», «yo soy tu Dios».",
      "Dos órdenes: no temas y no desmayes.",
      "Tres acciones de Dios: fortalecer, ayudar y sustentar.",
      "Se dirige a Israel, llamado «siervo» suyo (41:8).",
    ],
    i: "El consuelo se apoya en quién es Dios y en lo que él hace por su pueblo, no en la ausencia de dificultades.",
    a: [
      "Ante una mala noticia: pedir fuerza para el día de hoy sin cargar solo con el mañana.",
      "En una crisis familiar o de salud: pedir ayuda concreta a personas de confianza, sin avergonzarte.",
      "Cuando el miedo te paralice: elegir un paso pequeño y darlo.",
    ],
    attitudes: {
      pos: [
        "Descansar en que Dios fortalece, ayuda y sostiene en medio de la prueba.",
      ],
      neg: [
        "Dejarte vencer por el temor y el desaliento como si estuvieras solo.",
      ],
    },
    q: [
      "¿Qué razones da Dios para que no temas?",
      "¿Qué diferencia hay entre fortalecer, ayudar y sustentar?",
      "¿A quién se dirigía originalmente esta palabra y en qué situación estaba?",
      "¿Qué temor concreto estás cargando hoy?",
      "¿Qué harías distinto si confiaras en esta promesa?",
    ],
    quiz: [
      {
        q: "¿A quién se dirige originalmente Dios en Isaías 41:8-14?",
        opts: ["A Israel, llamado «siervo» suyo", "Al imperio asirio", "A los discípulos en Galilea"],
        ans: 0,
      },
      {
        q: "¿Qué dos órdenes directas aparecen al inicio de Isaías 41:10?",
        opts: ["Canta y celebra", "No temas y no desmayes", "Huye y escóndete"],
        ans: 1,
      },
      {
        q: "¿Qué tres acciones promete Dios hacer por su pueblo en este versículo?",
        opts: [
          "Fortalecer, ayudar y sustentar",
          "Enriquecer, coronar y vengar",
          "Aislar, ocultar y silenciar",
        ],
        ans: 0,
      },
      {
        q: "¿En qué se apoya el consuelo de Isaías 41:10?",
        opts: [
          "En que nunca habrá tiempos difíciles",
          "En quién es Dios («yo estoy contigo», «yo soy tu Dios») y lo que él hace",
          "En la autosuficiencia humana",
        ],
        ans: 1,
      },
      {
        q: "¿Qué paso práctico recomienda la guía cuando el temor paraliza?",
        opts: [
          "Aislarse hasta resolver todo solo",
          "Pedir fuerza para hoy, apoyarse en personas de confianza y dar un paso pequeño",
          "Negar que existe la dificultad",
        ],
        ans: 1,
      },
    ],
  },
  "Mateo 6:33": {
    c: "Parte del Sermón del Monte, en la enseñanza de Jesús sobre la ansiedad y las prioridades (Mt. 6:25-34).",
    o: [
      "Jesús enseña en el Sermón del Monte (Mt. 5–7), dirigido a sus discípulos con la multitud presente.",
      "Viene después de repetir «no os afanéis» por comida, ropa y mañana (6:25-32).",
      "Un mandato: buscar primero el reino de Dios y su justicia.",
      "Una promesa: «todas estas cosas» (lo necesario) serán añadidas.",
    ],
    i: "Jesús ordena las prioridades: primero el reino y la justicia de Dios. Las necesidades básicas no se descuidan, pero dejan de dominar la vida.",
    a: [
      "Al planear la semana, apartar primero el tiempo para orar y servir, y luego llenar el resto.",
      "Al hacer un presupuesto: separar primero lo que das y lo que ahorras, y después los gastos.",
      "Si el trabajo te absorbe: poner un límite de horario para estar con tu familia y tu comunidad.",
    ],
    attitudes: {
      pos: [
        "Dar prioridad al reino de Dios y su justicia en tu agenda y decisiones.",
        "Confiar en que Dios proveerá lo necesario.",
      ],
      neg: [
        "Vivir consumido por la ansiedad material como si fuera el centro de todo.",
      ],
    },
    q: [
      "¿Qué estaba preocupando a quienes escuchaban a Jesús en este pasaje?",
      "¿Qué significa buscar «primero» el reino de Dios?",
      "¿Qué ocupa hoy el primer lugar en tu agenda?",
      "¿Qué prometió Jesús y qué no prometió?",
      "¿Qué cambiarías esta semana para poner primero lo que él menciona?",
    ],
    quiz: [
      {
        q: "¿En qué enseñanza más amplia de Jesús se encuentra Mateo 6:33?",
        opts: [
          "En las cartas pastorales",
          "En el Sermón del Monte (Mateo 5–7), sobre la ansiedad y las prioridades",
          "En las parábolas del mar",
        ],
        ans: 1,
      },
      {
        q: "¿Qué venía preocupando a quienes escuchaban a Jesús justo antes (vv. 25-32)?",
        opts: [
          "La comida, la ropa y el día de mañana",
          "La política de Roma",
          "La construcción de sinagogas",
        ],
        ans: 0,
      },
      {
        q: "¿Qué ordena Jesús buscar en primer lugar?",
        opts: [
          "La seguridad financiera",
          "El reino de Dios y su justicia",
          "El reconocimiento de la multitud",
        ],
        ans: 1,
      },
      {
        q: "¿Qué promete Jesús a quienes ponen primero el reino de Dios?",
        opts: [
          "Que las necesidades básicas («todas estas cosas») serán añadidas",
          "Que nunca tendrán que trabajar",
          "Que recibirán abundancia sin límites",
        ],
        ans: 0,
      },
      {
        q: "¿Cómo se aplica hoy el principio de Mateo 6:33?",
        opts: [
          "Descuidando el trabajo y la familia",
          "Ordenando primero la agenda, el presupuesto y las decisiones alrededor de Dios y su justicia",
          "Poniendo a Dios solo en el tiempo sobrante",
        ],
        ans: 1,
      },
    ],
  },
  "Salmo 46:1": {
    c: "Salmo atribuido en su encabezado a los hijos de Coré; expresa confianza en Dios ante la agitación.",
    o: [
      "Declara que Dios es refugio y fortaleza.",
      "Añade que es una ayuda muy pronta, es decir, disponible, en las tribulaciones.",
      "Los versículos 2-3 describen sacudidas de la tierra, montes y aguas, y dicen que no se temerá.",
      "Un estribillo se repite en los versículos 7 y 11: «el Señor de los ejércitos está con nosotros».",
    ],
    i: "La confianza en Dios no depende de que el entorno sea estable: en medio de la agitación, Dios es el lugar seguro.",
    a: [
      "En una crisis de salud o de trabajo: acudir a Dios en oración y también a personas que pueden ayudar.",
      "Cuando las noticias te angustien: reducir el consumo y leer el salmo completo.",
      "Acompañar a alguien que sufre con una acción concreta: una visita, una llamada o una comida.",
    ],
    attitudes: {
      pos: [
        "Acudir a Dios como primer refugio en medio de la crisis.",
        "Mantener la calma confiando en que su ayuda está disponible.",
      ],
      neg: [
        "Entrar en pánico o buscar seguridad primero fuera de Dios cuando todo se sacude.",
      ],
    },
    q: [
      "¿Qué imágenes de seguridad usa el salmo?",
      "¿Qué situaciones de agitación describe y qué dice que no hará el salmista?",
      "¿Qué significa que la ayuda sea «muy pronta»?",
      "¿Dónde buscas refugio primero cuando hay problemas?",
      "¿Qué te dice el estribillo de los versículos 7 y 11?",
    ],
    quiz: [
      {
        q: "¿Con qué dos palabras describe Salmo 46:1 lo que Dios es para su pueblo?",
        opts: ["Juez y legislador", "Refugio y fortaleza", "Maestro y guía"],
        ans: 1,
      },
      {
        q: "¿Cómo califica el versículo la ayuda de Dios en las tribulaciones?",
        opts: ["Muy pronta (disponible)", "Tardía pero segura", "Condicional a la calma"],
        ans: 0,
      },
      {
        q: "¿Qué escenarios de crisis mencionan los versículos 2 y 3 del salmo?",
        opts: [
          "Sequías y hambrunas en el desierto",
          "Sacudidas de la tierra, montes que se traspasan y aguas agitadas",
          "Persecuciones en Roma",
        ],
        ans: 1,
      },
      {
        q: "¿Qué estribillo se repite en los versículos 7 y 11 del Salmo 46?",
        opts: [
          "«El Señor de los ejércitos está con nosotros»",
          "«Dad gracias en todo»",
          "«Grande es tu fidelidad»",
        ],
        ans: 0,
      },
      {
        q: "Según la interpretación del pasaje, ¿de qué depende la confianza en Dios?",
        opts: [
          "De que el entorno esté completamente estable",
          "De acudir a Dios como refugio aun en medio de la agitación",
          "De evitar enterarse de cualquier problema",
        ],
        ans: 1,
      },
    ],
  },
  "Colosenses 3:23": {
    c: "Carta de Pablo a los colosenses. Está dentro de instrucciones para la vida cotidiana (Col. 3:18–4:1); el v. 22 se dirige a esclavos.",
    o: [
      "Pablo escribe a la iglesia de Colosas.",
      "El versículo está en instrucciones para la vida diaria (3:18–4:1); el v. 22 se dirige a esclavos y el v. 23 amplía a «todo lo que hagáis».",
      "Un mandato: hacerlo de corazón.",
      "La razón: como para el Señor y no para las personas; el v. 24 menciona la recompensa que viene del Señor.",
    ],
    i: "El valor del trabajo se mide ante el Señor, no solo ante las personas. Hacerlo con integridad y entrega es una forma de servirle.",
    a: [
      "En el trabajo o el estudio: hacer bien una tarea poco visible.",
      "En casa: realizar las tareas domésticas con buena actitud y sin quejarte.",
      "En el servicio de la iglesia: cumplir lo que prometiste aunque nadie lo reconozca.",
    ],
    attitudes: {
      pos: [
        "Trabajar con entrega e integridad, haciéndolo de corazón como para el Señor.",
      ],
      neg: [
        "Hacer las tareas de mala gana o solo para quedar bien cuando alguien observa.",
      ],
    },
    q: [
      "¿A quién se dirigía originalmente el pasaje y en qué situación vivían?",
      "¿Qué cambia si piensas «para el Señor» y no «para la gente»?",
      "¿Qué significa hacerlo «de corazón»?",
      "¿Qué tarea has estado haciendo sin ganas?",
      "¿Cómo podrías servir a Dios en tu trabajo esta semana?",
    ],
    quiz: [
      {
        q: "¿Dentro de qué sección de la carta a los Colosenses aparece el versículo 3:23?",
        opts: [
          "En instrucciones para la vida cotidiana (Col. 3:18–4:1)",
          "En el saludo inicial de la carta",
          "En el relato de la creación",
        ],
        ans: 0,
      },
      {
        q: "¿Cómo pide el texto hacer todo lo que emprendas?",
        opts: [
          "Con prisa y eficacia",
          "De corazón, como para el Señor y no para las personas",
          "Solo cuando alguien supervisa",
        ],
        ans: 1,
      },
      {
        q: "¿A quién se dirigía el versículo anterior (v. 22) antes de ampliarse a «todo lo que hagáis»?",
        opts: ["A los reyes", "A los esclavos", "A los sacerdotes"],
        ans: 1,
      },
      {
        q: "Según el versículo 24, ¿de quién viene la recompensa por servir con entrega?",
        opts: ["Del Señor", "De la opinión pública", "De los jefes"],
        ans: 0,
      },
      {
        q: "¿Qué actitud negativa confronta Colosenses 3:23 en el trabajo o el hogar?",
        opts: [
          "Esforzarse en tareas poco visibles",
          "Hacer las labores de mala gana o solo para quedar bien ante la gente",
          "Cumplir los compromisos adquiridos",
        ],
        ans: 1,
      },
    ],
  },
  "Santiago 1:5": {
    c: "Carta de Santiago; en este pasaje habla de las pruebas y de pedir sabiduría (Stg. 1:2-8).",
    o: [
      "Es una condición: «si alguno tiene falta de sabiduría».",
      "El mandato es pedirla a Dios.",
      "Dios da a todos abundantemente y sin reproche.",
      "La promesa es «le será dada»; los versículos 6-8 piden pedir con fe, sin dudar.",
    ],
    i: "Dios es generoso para dar sabiduría a quien se la pide, y no reprocha la falta. Pedirla es parte de la respuesta a las pruebas, junto con la perseverancia (1:2-4).",
    a: [
      "Ante una decisión importante (cambiar de trabajo, un conflicto familiar): pedir sabiduría en oración antes de actuar.",
      "Si fallaste en algo: pedir sabiduría para no repetirlo, sin cargarte de culpa.",
      "Buscar el consejo de personas maduras mientras oras.",
    ],
    attitudes: {
      pos: [
        "Reconocer con humildad cuándo te falta sabiduría y pedirla a Dios con fe.",
      ],
      neg: [
        "Dudar de la generosidad de Dios al pedir.",
        "Actuar por impulso u orgullo sin buscar dirección.",
      ],
    },
    q: [
      "¿Qué condición pone el versículo y a quién va dirigido?",
      "¿Qué significa que Dios da «sin reproche»?",
      "¿Cómo se relacionan las pruebas (vv. 2-4) con pedir sabiduría?",
      "¿Qué decisión necesita sabiduría hoy y cuándo se la pedirás a Dios?",
      "¿Qué te frena a pedirla: la duda, la vergüenza o la prisa?",
    ],
    quiz: [
      {
        q: "¿A quién anima Santiago 1:5 a pedir sabiduría a Dios?",
        opts: [
          "A quien tenga falta de sabiduría",
          "Únicamente a los ancianos de la iglesia",
          "A quienes nunca han fallado",
        ],
        ans: 0,
      },
      {
        q: "¿Cómo da Dios la sabiduría según este versículo?",
        opts: [
          "Con reservas y tras largas pruebas",
          "A todos abundantemente y sin reproche",
          "Solo en casos extremos",
        ],
        ans: 1,
      },
      {
        q: "Según los versículos cercanos (vv. 6-8), ¿con qué actitud se debe pedir?",
        opts: ["Con fe, sin dudar", "Con temor al rechazo", "Exigiendo una respuesta inmediata"],
        ans: 0,
      },
      {
        q: "¿Con qué tema del comienzo del capítulo (vv. 2-4) se conecta el pedir sabiduría?",
        opts: [
          "Con enfrentar las pruebas con perseverancia",
          "Con la historia del éxodo",
          "Con las normas alimentarias",
        ],
        ans: 0,
      },
      {
        q: "¿Qué significa que Dios da «sin reproche»?",
        opts: [
          "Que da sin echar en cara nuestra falta ni avergonzarnos por pedir",
          "Que aprueba cualquier decisión impulsiva",
          "Que no requiere que escuchemos consejo",
        ],
        ans: 0,
      },
    ],
  },
  "Mateo 11:28": {
    c: "Invitación de Jesús al final del capítulo 11 (Mt. 11:25-30), tras su alabanza al Padre.",
    o: [
      "Jesús invita: «venid a mí».",
      "Se dirige a los fatigados y cargados.",
      "Promete: «yo os haré descansar».",
      "El versículo 29 explica cómo: tomar su yugo y aprender de él, que es manso y humilde de corazón.",
    ],
    i: "El descanso se ofrece en una relación con Jesús, no como una técnica: él invita, da descanso y enseña con mansedumbre.",
    a: [
      "Cuando estés agotado: apartar un rato a solas para orar y descansar sin culpa.",
      "Si cargas con cosas que no te tocan: pedir ayuda o delegar.",
      "Fijar un tiempo de descanso regular cada semana.",
    ],
    attitudes: {
      pos: [
        "Acercarte con humildad a Jesús cuando estás agotado para recibir su descanso.",
      ],
      neg: [
        "Seguir cargando solo el peso y el cansancio por autosuficiencia.",
      ],
    },
    q: [
      "¿A quiénes invita Jesús en este versículo?",
      "¿Qué diferencia hay entre descansar y simplemente parar?",
      "¿Qué quiere decir «tomar su yugo» según el versículo 29?",
      "¿Qué carga llevas hoy que no te corresponde llevar solo?",
      "¿Qué paso concreto darías para responder a esta invitación?",
    ],
    quiz: [
      {
        q: "¿A quiénes dirige Jesús la invitación «venid a mí» en Mateo 11:28?",
        opts: [
          "A los que se sienten autosuficientes",
          "A los fatigados y cargados",
          "Solo a los maestros de la ley",
        ],
        ans: 1,
      },
      {
        q: "¿Qué promete dar Jesús a quienes acuden a él?",
        opts: ["Descanso", "Riquezas", "Autoridad política"],
        ans: 0,
      },
      {
        q: "Según el versículo siguiente (v. 29), ¿cómo describe Jesús su propio corazón?",
        opts: ["Severo y exigente", "Manso y humilde de corazón", "Distante y reservado"],
        ans: 1,
      },
      {
        q: "¿Qué invita a hacer el versículo 29 junto con venir a él?",
        opts: [
          "Aislarte del mundo",
          "Tomar su yugo y aprender de él",
          "Multiplicar las cargas por mérito propio",
        ],
        ans: 1,
      },
      {
        q: "¿Qué actitud negativa impide responder a Mateo 11:28?",
        opts: [
          "Pedir ayuda o delegar cargas que no te corresponden",
          "Seguir cargando solo el agotamiento por autosuficiencia",
          "Apartar un tiempo para orar y descansar",
        ],
        ans: 1,
      },
    ],
  },
  "1 Tesalonicenses 5:16-18": {
    c: "Parte de las exhortaciones finales de la primera carta de Pablo a los tesalonicenses (1 Ts. 5:12-22).",
    o: [
      "Pablo escribe a la iglesia de Tesalónica; forma parte de exhortaciones breves (5:12-22).",
      "Tres mandatos: estar siempre gozosos, orar sin cesar y dar gracias en todo.",
      "«Siempre», «sin cesar» y «en todo» expresan continuidad.",
      "El versículo 18 añade que esta es la voluntad de Dios para ellos en Cristo Jesús.",
    ],
    i: "El gozo, la oración y la gratitud son una manera de vivir con Dios de forma continua. La gratitud es «en» toda circunstancia, no «por» todo lo que ocurre.",
    a: [
      "Elegir tres momentos del día para orar brevemente: al despertar, al mediodía y al dormir.",
      "Escribir cada noche una cosa buena del día.",
      "Dar las gracias a una persona que te ayudó esta semana.",
    ],
    attitudes: {
      pos: [
        "Cultivar un espíritu gozoso, constante en la oración y agradecido en toda circunstancia.",
      ],
      neg: [
        "Dejarte dominar por la queja continua cuando las cosas no salen como esperabas.",
      ],
    },
    q: [
      "¿Qué tres mandatos aparecen y qué palabras acompañan a cada uno?",
      "¿Qué diferencia hay entre dar gracias «en todo» y «por todo»?",
      "¿Qué significa orar «sin cesar» en la vida real?",
      "¿Qué te dificulta estar agradecido esta semana?",
      "¿Con quién podrías compartir algo por lo que estás agradecido?",
    ],
    quiz: [
      {
        q: "¿Cuáles son los tres mandatos que aparecen en 1 Tesalonicenses 5:16-18?",
        opts: [
          "Callar, ayunar y esperar",
          "Estar siempre gozosos, orar sin cesar y dar gracias en todo",
          "Estudiar, viajar y enseñar",
        ],
        ans: 1,
      },
      {
        q: "¿Qué palabras acompañan a cada mandato para indicar continuidad en la vida diaria?",
        opts: [
          "«Siempre», «sin cesar» y «en todo»",
          "«A veces», «en privado» y «si conviene»",
          "«Solo los sábados»",
        ],
        ans: 0,
      },
      {
        q: "Según el versículo 18, ¿qué afirma Pablo sobre esta forma de vivir?",
        opts: [
          "Que es opcional para líderes",
          "Que esta es la voluntad de Dios para ellos en Cristo Jesús",
          "Que aplica únicamente en tiempos de bonanza",
        ],
        ans: 1,
      },
      {
        q: "¿Cuál es la diferencia clave entre dar gracias «en todo» y dar gracias «por todo»?",
        opts: [
          "Dar gracias «en todo» significa agradecer en medio de cualquier circunstancia, sin llamar bueno a lo malo",
          "Significan exactamente lo mismo",
          "Dar gracias «en todo» solo aplica cuando todo sale bien",
        ],
        ans: 0,
      },
      {
        q: "¿Qué significa en la práctica «orar sin cesar»?",
        opts: [
          "Mantener una relación continua y habitual de diálogo con Dios a lo largo del día",
          "Dejar de trabajar para hablar solo en el templo",
          "Repetir una misma frase sin pensar",
        ],
        ans: 0,
      },
      {
        q: "¿Qué hábito sencillo ayuda a vivir este pasaje?",
        opts: [
          "Quejarse de cada contratiempo",
          "Elegir momentos breves del día para orar y agradecer algo concreto",
          "Esperar a estar libre de problemas para dar gracias",
        ],
        ans: 1,
      },
    ],
  },
  "Gálatas 6:9": {
    c: "Parte de las exhortaciones finales de la carta de Pablo a los gálatas, sobre ayudarse unos a otros (Gá. 6:1-10).",
    o: [
      "Pablo escribe a las iglesias de Galacia; el pasaje trata de ayudarse unos a otros (6:1-10).",
      "El mandato es no cansarse de hacer el bien.",
      "La promesa depende de una condición: a su tiempo se cosechará si no se desmaya.",
      "Usa la imagen de sembrar y cosechar (vv. 7-8).",
    ],
    i: "Hacer el bien requiere constancia. El fruto llega «a su tiempo», no de inmediato, y la perseverancia es la condición.",
    a: [
      "Seguir llamando o visitando a alguien que sufre, aunque no veas cambios rápidos.",
      "Mantener un servicio regular, como ayudar en tu comunidad cada semana.",
      "Corregir con paciencia en casa en vez de rendirte.",
    ],
    attitudes: {
      pos: [
        "Perseverar haciendo el bien con paciencia aunque el fruto tarde en verse.",
      ],
      neg: [
        "Rendirte y abandonar lo bueno por desánimo al no ver resultados inmediatos.",
      ],
    },
    q: [
      "¿Qué imagen usa Pablo y qué dice sobre el tiempo?",
      "¿Qué condición pone el versículo para cosechar?",
      "¿Qué bien has dejado de hacer por cansancio?",
      "¿Qué te ayudaría a perseverar, sobre todo en lo que no da resultados rápidos?",
      "¿A quién podrías ayudar esta semana y cómo?",
    ],
    quiz: [
      {
        q: "¿Qué exhorta a no hacer Gálatas 6:9?",
        opts: [
          "No hablar con extraños",
          "No cansarse de hacer el bien",
          "No trabajar en exceso",
        ],
        ans: 1,
      },
      {
        q: "¿Qué condición pone el versículo para cosechar?",
        opts: [
          "Si no desmayamos (si perseveramos)",
          "Si vemos resultados en la primera semana",
          "Si recibimos reconocimiento público",
        ],
        ans: 0,
      },
      {
        q: "¿Cuándo promete el pasaje que se cosechará?",
        opts: ["De manera inmediata", "A su tiempo", "Al final de cada mes"],
        ans: 1,
      },
      {
        q: "¿Qué imagen agrícola usa Pablo en el contexto cercano (vv. 7-8) para reforzar esta idea?",
        opts: ["Sembrar y cosechar", "Construir sobre arena y roca", "La vid y el trigo"],
        ans: 0,
      },
      {
        q: "¿Dentro de qué tema más amplio (Gá. 6:1-10) se encuentra esta exhortación?",
        opts: [
          "Ayudarse unos a otros y hacer el bien en comunidad",
          "Normas sobre la construcción de iglesias",
          "Crónicas de viajes misioneros",
        ],
        ans: 0,
      },
    ],
  },
  "Salmo 23:1": {
    c: "Salmo que su encabezado atribuye a David y que usa la imagen del pastor.",
    o: [
      "El encabezado lo atribuye a David.",
      "Usa una imagen en primera persona: «el Señor es mi pastor».",
      "Consecuencia: «nada me faltará».",
      "El salmo desarrolla la imagen: pastos, aguas de reposo, sendas, el valle de sombra de muerte, la mesa y la casa del Señor.",
    ],
    i: "Dios cuida como un pastor: guía, provee y acompaña. La confianza se apoya en quién es el pastor, no en la ausencia de dificultades, porque el propio salmo menciona el valle de sombra de muerte.",
    a: [
      "Cuando sientas carencia: enumerar lo que sí tienes, agradecerlo y pedir lo que necesitas.",
      "Al decidir: buscar la guía de Dios en su Palabra y en consejeros de confianza.",
      "En momentos de miedo: leer el salmo completo.",
    ],
    attitudes: {
      pos: [
        "Confiar con serenidad en el cuidado y la provisión de Dios como pastor.",
      ],
      neg: [
        "Vivir con mentalidad de escasez y temor olvidando que Dios cuida de ti.",
      ],
    },
    q: [
      "¿Qué hace un pastor por sus ovejas y cómo aparece en el salmo?",
      "¿Qué significa «nada me faltará» a la luz del resto del salmo?",
      "¿Qué lugares y momentos menciona el salmo, desde los pastos hasta el valle oscuro?",
      "¿Dónde sientes hoy falta o necesidad?",
      "¿Quién ha sido un «pastor» para ti y cómo podrías serlo para otro?",
    ],
    quiz: [
      {
        q: "¿A quién atribuye el encabezado el Salmo 23?",
        opts: ["A Salomón", "A David", "A Moisés"],
        ans: 1,
      },
      {
        q: "¿Qué imagen usa el salmista en primera persona para describir al Señor en el versículo 1?",
        opts: [
          "«El Señor es mi pastor»",
          "«El Señor es mi arquitecto»",
          "«El Señor es mi escudo de hierro»",
        ],
        ans: 0,
      },
      {
        q: "¿Qué consecuencia declara el salmo a partir de esa relación con Dios?",
        opts: [
          "«Nada me faltará»",
          "«Nunca conoceré la tristeza»",
          "«Todos me aplaudirán»",
        ],
        ans: 0,
      },
      {
        q: "¿Por qué sabemos que «nada me faltará» no significa ausencia de momentos difíciles?",
        opts: [
          "Porque el mismo salmo menciona atravesar «el valle de sombra de muerte»",
          "Porque el salmo termina en derrota",
          "Porque el pastor abandona a las ovejas en la tormenta",
        ],
        ans: 0,
      },
      {
        q: "¿Qué actitud positiva nace de este versículo?",
        opts: [
          "Confiar con serenidad en el cuidado, la guía y la provisión de Dios",
          "Vivir con temor constante a la escasez",
          "Depender solo de lo que acumulas",
        ],
        ans: 0,
      },
    ],
  },
  "Romanos 12:2": {
    c: "Inicio de la sección práctica de la carta de Pablo a los romanos (Ro. 12:1), tras los capítulos 1–11.",
    o: [
      "Pablo escribe a los creyentes en Roma; el versículo 1 empieza con «por las misericordias de Dios».",
      "Dos mandatos: no conformarse a este siglo y ser transformados mediante la renovación del entendimiento.",
      "«Transformaos» está en voz pasiva: se trata de ser transformado.",
      "El propósito: comprobar cuál es la voluntad de Dios, buena, agradable y perfecta.",
    ],
    i: "El cambio de vida empieza en la mente: dejarse transformar por Dios, y no moldear por la cultura del entorno, permite discernir su voluntad.",
    a: [
      "Revisar qué contenido consumes (redes, series, noticias) y qué efecto tiene en tus pensamientos y decisiones.",
      "Reemplazar un pensamiento repetido, como «no sirvo para nada», por lo que dice la Biblia sobre ti.",
      "Dedicar tiempo diario a la Biblia para ir renovando tus criterios.",
    ],
    attitudes: {
      pos: [
        "Mantener una mente dispuesta a ser renovada y transformada por Dios.",
      ],
      neg: [
        "Amoldarte pasivamente a los criterios y costumbres del entorno sin discernimiento.",
      ],
    },
    q: [
      "¿Qué significa «este siglo» y cómo se refleja en tu entorno?",
      "¿Qué diferencia hay entre conformarse y ser transformado?",
      "¿Qué pensamiento o criterio tuyo necesita renovarse?",
      "¿Qué relación ves entre este versículo y el versículo 1?",
      "¿Qué hábito te ayudaría a renovar tu mente de forma constante?",
    ],
    quiz: [
      {
        q: "¿Qué dos mandatos presenta Romanos 12:2?",
        opts: [
          "No conformarse a este siglo y ser transformados mediante la renovación del entendimiento",
          "Separarse de toda sociedad y guardar silencio",
          "Seguir las costumbres del entorno para evitar conflictos",
        ],
        ans: 0,
      },
      {
        q: "Según el versículo, ¿por qué medio ocurre esa transformación?",
        opts: [
          "Por la presión del grupo",
          "Mediante la renovación de nuestra manera de pensar (entendimiento)",
          "Por esfuerzo meramente externo",
        ],
        ans: 1,
      },
      {
        q: "¿Cuál es el propósito de esa transformación al final de Romanos 12:2?",
        opts: [
          "Comprobar cuál es la voluntad de Dios, buena, agradable y perfecta",
          "Obtener prestigio entre los demás",
          "Ganar debates filosóficos",
        ],
        ans: 0,
      },
      {
        q: "¿En qué se apoya el llamado práctico de Romanos 12 según el versículo anterior (v. 1)?",
        opts: ["En «las misericordias de Dios»", "En el temor al castigo", "En la superioridad moral"],
        ans: 0,
      },
      {
        q: "¿Qué práctica cotidiana se alinea con la renovación de la mente que pide este texto?",
        opts: [
          "Imitar sin filtro todo lo que marcan las redes o el entorno",
          "Examinar qué contenido alimenta tus pensamientos y contrastarlo con la Biblia",
          "Evitar reflexionar sobre tus propios criterios",
        ],
        ans: 1,
      },
    ],
  },
  "Lamentaciones 3:22-23": {
    c: "Está en un libro de lamento por la destrucción de Jerusalén; el capítulo 3 expresa esperanza en medio del dolor. El libro no nombra a su autor.",
    o: [
      "Está en un libro de lamento por la destrucción de Jerusalén.",
      "El capítulo 3 expresa primero dolor (vv. 1-20) y luego esperanza (vv. 21-24).",
      "Dice que las misericordias del Señor no se acaban y que sus compasiones no se agotan.",
      "Son nuevas cada mañana, y el versículo 23 termina con «grande es tu fidelidad».",
    ],
    i: "La esperanza no ignora el dolor: nace de recordar el carácter fiel de Dios, que se renueva cada día.",
    a: [
      "Al empezar el día, nombrar una muestra de la fidelidad de Dios en la última semana.",
      "Si atraviesas una pérdida: permitirte lamentar y a la vez recordar lo que Dios sigue haciendo.",
      "Llevar un registro de respuestas y provisiones para releer en los días difíciles.",
    ],
    attitudes: {
      pos: [
        "Aferrarte a la esperanza recordando la fidelidad y compasión diaria de Dios.",
      ],
      neg: [
        "Ceder a la desesperanza creyendo que el dolor actual borra la fidelidad de Dios.",
      ],
    },
    q: [
      "¿Qué contraste hay entre los versículos 1-20 y los versículos 21-24?",
      "¿Qué significa que las misericordias sean «nuevas cada mañana»?",
      "¿Qué hizo el autor para pasar del dolor a la esperanza (v. 21)?",
      "¿Qué muestra de la fidelidad de Dios puedes recordar hoy?",
      "¿A quién podrías animar compartiéndole este versículo?",
    ],
    quiz: [
      {
        q: "¿En qué contexto literario e histórico se escribe el libro de Lamentaciones?",
        opts: [
          "En un libro de lamento por la destrucción de Jerusalén",
          "En una carta de Pablo desde Éfeso",
          "En las leyes entregadas en el Sinaí",
        ],
        ans: 0,
      },
      {
        q: "¿Qué afirma el versículo 22 sobre el amor y las misericordias del Señor?",
        opts: [
          "Que son temporales",
          "Que nunca se agotan ni tienen fin",
          "Que dependen de que no haya dolor",
        ],
        ans: 1,
      },
      {
        q: "¿Con qué frecuencia se renuevan las compasiones de Dios según el versículo 23?",
        opts: ["Cada año", "Cada mañana", "Cada siete años"],
        ans: 1,
      },
      {
        q: "¿Con qué exclamación cierra Lamentaciones 3:23?",
        opts: ["«Grande es tu fidelidad»", "«Todo está resuelto»", "«No tengas miedo»"],
        ans: 0,
      },
      {
        q: "¿Qué contraste hay dentro del mismo capítulo 3 de Lamentaciones?",
        opts: [
          "Primero expresa profundo dolor (vv. 1-20) y luego esperanza al recordar quién es Dios (vv. 21-24)",
          "Empieza con alegría y termina sin esperanza",
          "Habla solo de victorias militares",
        ],
        ans: 0,
      },
      {
        q: "¿Qué enseñanza central deja este pasaje sobre la esperanza?",
        opts: [
          "La esperanza ignora o niega el sufrimiento",
          "La esperanza no niega el dolor, sino que nace de recordar el carácter fiel de Dios",
          "Solo se puede esperar cuando la pérdida desaparece",
        ],
        ans: 1,
      },
    ],
  },
};

export const GQ = [
  "¿Qué dice el pasaje sobre Dios y sobre las personas?",
  "¿Qué palabra o idea se repite o destaca?",
  "¿Qué promete, ordena o advierte?",
  "¿Qué te sorprende o te cuesta aceptar?",
  "¿Con qué otro pasaje de la Biblia se relaciona?",
  "¿Qué harás concretamente esta semana con lo que leíste?",
];

export const KL: Record<string, string> = {
  reflexion: "Reflexión bíblica",
  oracion: "Oración",
  gratitud: "Gratitud",
  nota: "Nota",
};

export const ACT0: [string, [string, string][]][] = [
  [
    "Cómo me siento",
    [
      ["gozo", "🌻"],
      ["entusiasmo", "✨"],
      ["gratitud", "🙌"],
      ["paz", "🕊️"],
      ["plenitud", "🌿"],
      ["agotamiento", "🔋"],
      ["dudas", "🌫️"],
      ["desgano", "😶"],
      ["inquietud", "🌀"],
      ["irritación", "🔥"],
      ["presión", "⏳"],
      ["pena", "🌧️"],
      ["abatimiento", "🍂"],
    ],
  ],
  [
    "Descanso",
    [
      ["dormir bien", "😴"],
      ["dormir regular", "🛏️"],
      ["dormir mal", "🥱"],
      ["dormir temprano", "⏰"],
    ],
  ],
  [
    "Cuerpo",
    [
      ["hacer ejercicio", "🏋️"],
      ["comer sano", "🥗"],
      ["beber agua", "💧"],
      ["caminar", "🚶"],
      ["correr", "🏃"],
      ["comida chatarra", "🍔"],
    ],
  ],
  [
    "Vida espiritual",
    [
      ["orar", "🙏"],
      ["leer la Biblia", "📖"],
      ["ir a la iglesia", "⛪"],
      ["adorar", "🎵"],
      ["servir", "🤝"],
      ["ayunar", "🍞"],
    ],
  ],
  [
    "Relaciones",
    [
      ["familia", "👨‍👩‍👧"],
      ["amigos", "🧑‍🤝‍🧑"],
      ["pareja", "❤️"],
      ["fiesta", "🎉"],
      ["soledad", "🚪"],
    ],
  ],
  [
    "Trabajo y estudio",
    [
      ["trabajo", "💼"],
      ["estudio", "📚"],
      ["reunión", "🗓️"],
      ["proyecto", "🧩"],
      ["descanso", "☕"],
    ],
  ],
  [
    "Tiempo libre",
    [
      ["películas", "🎬"],
      ["música", "🎧"],
      ["juegos", "🎮"],
      ["lectura", "📚"],
      ["naturaleza", "🌳"],
      ["viajar", "✈️"],
    ],
  ],
  [
    "Cuidado propio",
    [
      ["corte de pelo", "✂️"],
      ["masaje", "💆"],
      ["spa", "🛁"],
      ["cuidado de la piel", "🧖"],
      ["manicure", "💅"],
    ],
  ],
];

export const defaultActs = (): ActivityCategory[] =>
  ACT0.map((c, ci) => ({
    id: "c" + ci,
    n: c[0],
    on: true,
    items: c[1].map((x, i) => ({ id: "a" + ci + "_" + i, n: x[0], ic: x[1] })),
  }));

export const RMO_OPTIONS = [
  { value: "", label: "Sin recordatorio" },
  { value: "0", label: "El mismo día" },
  { value: "1", label: "1 día antes" },
  { value: "3", label: "3 días antes" },
  { value: "7", label: "1 semana antes" },
];

export const RM: Record<number, string> = {
  0: "el mismo día",
  1: "1 día antes",
  3: "3 días antes",
  7: "1 semana antes",
};

export const WD: Record<number, number[]> = {
  1: [1],
  2: [1, 4],
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 3, 4, 5, 6],
  7: [0, 1, 2, 3, 4, 5, 6],
};

export const MN: Record<string, string> = {
  a: "acciones completadas",
  num: "meta numérica",
  count: "contador de veces",
  time: "tiempo acumulado",
  scale: "autoevaluación 1–10",
  pct: "porcentaje manual",
  yn: "logrado sí o no",
  streak: "racha de días",
};

export const SZ: Record<string, { n: number; w: string; l: string }> = {
  b: { n: 4, w: "120 a 170", l: "Breve" },
  c: { n: 6, w: "200 a 280", l: "Completo" },
  e: { n: 8, w: "280 a 380", l: "Exhaustivo" },
};
