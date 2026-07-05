/* ============================================================
   SmartWorkout Planner — rutina con gomas elásticas + déficit
   ============================================================ */

const STORAGE_KEY = 'swp-datos';
const TUBOS_KEY = 'swp-tubos';

// Tubos por defecto (aprox. set SmartWorkout Elite). Editables en la app.
const TUBOS_DEFAULT = [
  { color: 'Amarillo', kg: 5 },
  { color: 'Rojo', kg: 10 },
  { color: 'Negro', kg: 15 },
  { color: 'Morado', kg: 20 },
  { color: 'Verde', kg: 25 },
  { color: 'Azul', kg: 30 },
];

let tubos = cargarTubos();

/* ---------- Base de ejercicios ----------
   factor = tensión objetivo como fracción del peso corporal (nivel intermedio) */
const EJERCICIOS = {
  sentadilla:      { nombre: 'Sentadilla con barra', setup: 'Pisa las gomas, barra sobre hombros', factor: 0.55, tipo: 'compuesto' },
  pesoMuerto:      { nombre: 'Peso muerto rumano', setup: 'Pisa las gomas, agarre con barra o asas', factor: 0.60, tipo: 'compuesto' },
  zancada:         { nombre: 'Zancada búlgara / estática', setup: 'Pisa la goma con el pie adelantado, asas', factor: 0.35, tipo: 'compuesto' },
  hipThrust:       { nombre: 'Empuje de cadera (hip thrust)', setup: 'Goma sobre cadera, anclada bajo los pies o banco', factor: 0.60, tipo: 'compuesto' },
  pressPecho:      { nombre: 'Press de pecho', setup: 'Anclaje de puerta a media altura, de espaldas', factor: 0.45, tipo: 'compuesto' },
  aperturas:       { nombre: 'Aperturas de pecho', setup: 'Anclaje medio, de espaldas, brazos semiextendidos', factor: 0.20, tipo: 'aislamiento' },
  remo:            { nombre: 'Remo sentado', setup: 'Anclaje bajo o gomas en los pies, sentado', factor: 0.45, tipo: 'compuesto' },
  jalon:           { nombre: 'Jalón al pecho', setup: 'Anclaje de puerta arriba, de rodillas o sentado', factor: 0.40, tipo: 'compuesto' },
  pressHombro:     { nombre: 'Press de hombro', setup: 'Pisa las gomas, empuja con asas o barra', factor: 0.30, tipo: 'compuesto' },
  elevLaterales:   { nombre: 'Elevaciones laterales', setup: 'Pisa la goma con un pie, asa en cada mano', factor: 0.12, tipo: 'aislamiento' },
  facePull:        { nombre: 'Face pull', setup: 'Anclaje de puerta arriba, tira hacia la cara', factor: 0.20, tipo: 'aislamiento' },
  curl:            { nombre: 'Curl de bíceps', setup: 'Pisa las gomas, asas o barra', factor: 0.20, tipo: 'aislamiento' },
  triceps:         { nombre: 'Extensión de tríceps', setup: 'Anclaje arriba, empuja hacia abajo', factor: 0.20, tipo: 'aislamiento' },
  pallof:          { nombre: 'Press Pallof (core)', setup: 'Anclaje medio, de lado, empuja al frente', factor: 0.15, tipo: 'aislamiento' },
  abduccion:       { nombre: 'Abducción de cadera', setup: 'Tobilleras + anclaje bajo, de lado', factor: 0.15, tipo: 'aislamiento' },
  patadaGluteo:    { nombre: 'Patada de glúteo', setup: 'Tobilleras + anclaje bajo, a cuadrupedia o de pie', factor: 0.20, tipo: 'aislamiento' },
  remoUnaMano:     { nombre: 'Remo a una mano', setup: 'Anclaje bajo, postura escalonada', factor: 0.25, tipo: 'compuesto' },
  crunchGoma:      { nombre: 'Crunch con goma', setup: 'Anclaje arriba, de rodillas, flexiona el tronco', factor: 0.20, tipo: 'aislamiento' },
};

/* ---------- Plantillas de rutina por días/semana ---------- */
const RUTINAS = {
  2: [
    { titulo: 'Día 1 · Full Body A', ejercicios: ['sentadilla', 'pressPecho', 'remo', 'pressHombro', 'curl', 'pallof'], finisher: '8 min: 30 s de burpees suaves + 30 s de descanso' },
    { titulo: 'Día 2 · Full Body B', ejercicios: ['pesoMuerto', 'jalon', 'zancada', 'aperturas', 'triceps', 'crunchGoma'], finisher: '10 min de comba o jumping jacks: 40 s trabajo / 20 s descanso' },
  ],
  3: [
    { titulo: 'Día 1 · Full Body A', ejercicios: ['sentadilla', 'pressPecho', 'remo', 'elevLaterales', 'curl', 'pallof'], finisher: '8 min: 30 s de burpees suaves + 30 s de descanso' },
    { titulo: 'Día 2 · Full Body B', ejercicios: ['pesoMuerto', 'jalon', 'pressHombro', 'zancada', 'triceps', 'crunchGoma'], finisher: '10 min de comba: 40 s trabajo / 20 s descanso' },
    { titulo: 'Día 3 · Full Body C', ejercicios: ['hipThrust', 'remoUnaMano', 'aperturas', 'facePull', 'abduccion', 'pallof'], finisher: '10 min: sentadilla con salto ×10 + mountain climbers ×20, tantas rondas como puedas' },
  ],
  4: [
    { titulo: 'Día 1 · Torso A', ejercicios: ['pressPecho', 'remo', 'pressHombro', 'jalon', 'curl', 'triceps'], finisher: '8 min: 30 s de burpees suaves + 30 s de descanso' },
    { titulo: 'Día 2 · Pierna A', ejercicios: ['sentadilla', 'pesoMuerto', 'zancada', 'abduccion', 'pallof', 'crunchGoma'], finisher: '10 min de comba: 40 s trabajo / 20 s descanso' },
    { titulo: 'Día 3 · Torso B', ejercicios: ['jalon', 'aperturas', 'remoUnaMano', 'elevLaterales', 'facePull', 'triceps'], finisher: '8 min: shadow boxing 45 s / 15 s descanso' },
    { titulo: 'Día 4 · Pierna B', ejercicios: ['hipThrust', 'zancada', 'pesoMuerto', 'patadaGluteo', 'abduccion', 'pallof'], finisher: '10 min: sentadilla con salto ×10 + mountain climbers ×20, rondas seguidas' },
  ],
  5: [
    { titulo: 'Día 1 · Empuje', ejercicios: ['pressPecho', 'pressHombro', 'aperturas', 'elevLaterales', 'triceps'], finisher: '8 min: 30 s de burpees suaves + 30 s de descanso' },
    { titulo: 'Día 2 · Tirón', ejercicios: ['jalon', 'remo', 'remoUnaMano', 'facePull', 'curl'], finisher: '8 min de comba: 40 s trabajo / 20 s descanso' },
    { titulo: 'Día 3 · Pierna', ejercicios: ['sentadilla', 'pesoMuerto', 'zancada', 'abduccion', 'crunchGoma'], finisher: '10 min: sentadilla con salto ×10 + mountain climbers ×20' },
    { titulo: 'Día 4 · Torso', ejercicios: ['pressPecho', 'remo', 'pressHombro', 'jalon', 'pallof'], finisher: '8 min: shadow boxing 45 s / 15 s descanso' },
    { titulo: 'Día 5 · Pierna + glúteo', ejercicios: ['hipThrust', 'zancada', 'patadaGluteo', 'abduccion', 'crunchGoma'], finisher: '12 min de cardio suave (marcha rápida o step)' },
  ],
  6: [
    { titulo: 'Día 1 · Empuje A', ejercicios: ['pressPecho', 'pressHombro', 'aperturas', 'elevLaterales', 'triceps'], finisher: '8 min: 30 s de burpees suaves + 30 s de descanso' },
    { titulo: 'Día 2 · Tirón A', ejercicios: ['jalon', 'remo', 'facePull', 'curl', 'pallof'], finisher: '8 min de comba: 40 s trabajo / 20 s descanso' },
    { titulo: 'Día 3 · Pierna A', ejercicios: ['sentadilla', 'pesoMuerto', 'zancada', 'abduccion', 'crunchGoma'], finisher: '10 min: sentadilla con salto ×10 + mountain climbers ×20' },
    { titulo: 'Día 4 · Empuje B', ejercicios: ['pressHombro', 'pressPecho', 'elevLaterales', 'aperturas', 'triceps'], finisher: '8 min: shadow boxing 45 s / 15 s descanso' },
    { titulo: 'Día 5 · Tirón B', ejercicios: ['remoUnaMano', 'jalon', 'remo', 'facePull', 'curl'], finisher: '8 min: jumping jacks 40 s / 20 s descanso' },
    { titulo: 'Día 6 · Pierna B + glúteo', ejercicios: ['hipThrust', 'zancada', 'patadaGluteo', 'abduccion', 'pallof'], finisher: '12 min de cardio suave (marcha rápida o step)' },
  ],
};

const NIVEL_FACTOR = { principiante: 0.7, intermedio: 1.0, avanzado: 1.25 };
const NIVEL_SERIES = { principiante: 3, intermedio: 3, avanzado: 4 };

/* ============ CÁLCULOS ============ */

function calcularPlan(d) {
  // Mifflin-St Jeor
  const bmr = 10 * d.peso + 6.25 * d.estatura - 5 * d.edad + (d.sexo === 'H' ? 5 : -161);
  // Gasto por entrenos con gomas (~250 kcal/sesión) repartido en la semana
  const gastoEntreno = (d.dias * 250) / 7;
  const tdee = bmr * d.actividad + gastoEntreno;
  const minimo = d.sexo === 'H' ? 1500 : 1200;
  const objetivo = Math.max(Math.round(tdee * (1 - d.ritmo)), minimo);
  const deficitDiario = Math.round(tdee - objetivo);

  // Macros: proteína 1.8 g/kg, grasa 0.8 g/kg, resto carbohidratos
  const proteina = Math.round(d.peso * 1.8);
  const grasa = Math.round(d.peso * 0.8);
  let carbos = Math.round((objetivo - proteina * 4 - grasa * 9) / 4);
  if (carbos < 50) carbos = 50;

  // Ritmo estimado de pérdida (7700 kcal ≈ 1 kg de grasa)
  const kgSemana = ((deficitDiario * 7) / 7700).toFixed(2);

  return { bmr: Math.round(bmr), tdee: Math.round(tdee), objetivo, deficitDiario, proteina, grasa, carbos, kgSemana, minimoAplicado: objetivo === minimo };
}

/* Mejor combinación de tubos (hasta 3) para una tensión objetivo */
function mejorCombo(targetKg) {
  const n = tubos.length;
  let mejor = null;
  for (let mask = 1; mask < (1 << n); mask++) {
    const combo = [];
    let suma = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) { combo.push(tubos[i]); suma += Number(tubos[i].kg); }
    }
    if (combo.length > 3) continue;
    const diff = Math.abs(suma - targetKg) + combo.length * 0.3; // prefiere combos simples
    if (!mejor || diff < mejor.diff) mejor = { combo, suma, diff };
  }
  return mejor;
}

function resistenciaSugerida(peso, factorEjercicio, nivel) {
  return Math.max(5, Math.round(peso * factorEjercicio * NIVEL_FACTOR[nivel]));
}

/* ============ RENDER ============ */

function render(d) {
  const plan = calcularPlan(d);

  document.getElementById('stats-calorias').innerHTML = `
    <div class="stat"><div class="valor">${plan.bmr}</div><div class="etiqueta">Metabolismo basal (kcal)</div></div>
    <div class="stat"><div class="valor">${plan.tdee}</div><div class="etiqueta">Mantenimiento (kcal)</div></div>
    <div class="stat destacado"><div class="valor">${plan.objetivo}</div><div class="etiqueta">Objetivo diario (kcal)</div></div>
    <div class="stat"><div class="valor">−${plan.kgSemana} kg</div><div class="etiqueta">Ritmo estimado / semana</div></div>`;

  document.getElementById('macros').innerHTML = `
    <div class="macro">🥩 Proteína<b>${plan.proteina} g</b></div>
    <div class="macro">🥑 Grasa<b>${plan.grasa} g</b></div>
    <div class="macro">🍚 Carbohidratos<b>${plan.carbos} g</b></div>`;

  document.getElementById('nota-calorias').textContent = plan.minimoAplicado
    ? 'Se ha aplicado el mínimo de seguridad: no conviene comer menos de esto sin supervisión profesional.'
    : `Déficit de ~${plan.deficitDiario} kcal/día sobre tu mantenimiento. Ajusta según tu báscula cada 2 semanas.`;

  // Rutina
  const dias = RUTINAS[d.dias];
  const series = NIVEL_SERIES[d.nivel];
  document.getElementById('resumen-rutina').textContent =
    `${d.dias} días/semana · nivel ${d.nivel} · ${series} series por ejercicio · descansa 60-90 s entre series. Deja al menos un día de descanso entre sesiones que repitan músculos.`;

  document.getElementById('rutina').innerHTML = dias.map(dia => {
    const filas = dia.ejercicios.map(key => {
      const ej = EJERCICIOS[key];
      const target = resistenciaSugerida(d.peso, ej.factor, d.nivel);
      const combo = mejorCombo(target);
      const gomas = combo.combo.map(t => `${t.color} (${t.kg} kg)`).join(' + ');
      const reps = ej.tipo === 'compuesto' ? '8-12' : '12-15';
      return `<tr>
        <td>${ej.nombre}<span class="setup">${ej.setup}</span></td>
        <td>${series}×${reps}</td>
        <td><span class="goma-tag">${gomas}</span><span class="setup">~${combo.suma} kg (objetivo ${target} kg)</span></td>
      </tr>`;
    }).join('');
    return `<div class="dia">
      <h3>${dia.titulo}</h3>
      <div class="subtitulo">Calienta 5 min: movilidad + 1 serie ligera de cada ejercicio</div>
      <table>
        <thead><tr><th>Ejercicio</th><th>Series×Reps</th><th>Gomas sugeridas</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <div class="finisher"><b>Finisher cardio:</b> ${dia.finisher}</div>
    </div>`;
  }).join('');

  // Cardio semanal
  const pasos = d.ritmo >= 0.25 ? '10.000-12.000' : '8.000-10.000';
  const liss = 7 - d.dias >= 2 ? 2 : 1;
  document.getElementById('cardio').innerHTML = `
    <div class="cardio-item"><b>Pasos diarios:</b> ${pasos} pasos al día. Es el cardio más sostenible y el que más ayuda al déficit sin generar fatiga.</div>
    <div class="cardio-item"><b>Cardio suave (LISS):</b> ${liss} sesión${liss > 1 ? 'es' : ''} de 30-45 min en día${liss > 1 ? 's' : ''} de descanso: caminar rápido, bici o elíptica a ritmo que te permita hablar.</div>
    <div class="cardio-item"><b>Finishers:</b> ya incluidos al final de cada entreno (8-12 min). Si un día vas justo de tiempo, prioriza las gomas y salta el finisher.</div>
    <div class="cardio-item"><b>Descanso:</b> duerme 7-9 h. En déficit, dormir poco = más hambre y peor recuperación.</div>`;

  document.getElementById('resultados').classList.remove('hidden');
}

/* ============ EDITOR DE TUBOS ============ */

function renderTubos() {
  document.getElementById('tubos-editor').innerHTML = tubos.map((t, i) => `
    <div class="tubo">
      <span>${t.color}</span>
      <input type="number" min="1" max="60" value="${t.kg}" data-idx="${i}">
    </div>`).join('');
}

function cargarTubos() {
  try {
    const saved = JSON.parse(localStorage.getItem(TUBOS_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (e) { /* ignora datos corruptos */ }
  return TUBOS_DEFAULT.map(t => ({ ...t }));
}

/* ============ EVENTOS ============ */

function leerFormulario() {
  return {
    sexo: document.getElementById('sexo').value,
    edad: Number(document.getElementById('edad').value),
    estatura: Number(document.getElementById('estatura').value),
    peso: Number(document.getElementById('peso').value),
    dias: Number(document.getElementById('dias').value),
    actividad: Number(document.getElementById('actividad').value),
    nivel: document.getElementById('nivel').value,
    ritmo: Number(document.getElementById('ritmo').value),
  };
}

document.getElementById('user-form').addEventListener('submit', e => {
  e.preventDefault();
  const d = leerFormulario();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  render(d);
  document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('btn-tubos').addEventListener('click', () => {
  document.querySelectorAll('#tubos-editor input').forEach(inp => {
    tubos[Number(inp.dataset.idx)].kg = Number(inp.value) || tubos[Number(inp.dataset.idx)].kg;
  });
  localStorage.setItem(TUBOS_KEY, JSON.stringify(tubos));
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) render(JSON.parse(saved));
});

document.getElementById('btn-print').addEventListener('click', () => window.print());

document.getElementById('btn-reset').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById('resultados').classList.add('hidden');
  document.getElementById('user-form').reset();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============ INICIO ============ */

renderTubos();
const guardado = localStorage.getItem(STORAGE_KEY);
if (guardado) {
  const d = JSON.parse(guardado);
  // Rellena el formulario con los últimos datos
  document.getElementById('sexo').value = d.sexo;
  document.getElementById('edad').value = d.edad;
  document.getElementById('estatura').value = d.estatura;
  document.getElementById('peso').value = d.peso;
  document.getElementById('dias').value = d.dias;
  document.getElementById('actividad').value = d.actividad;
  document.getElementById('nivel').value = d.nivel;
  document.getElementById('ritmo').value = d.ritmo;
  render(d);
}
