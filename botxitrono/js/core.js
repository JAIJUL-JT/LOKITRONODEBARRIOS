// LokiTrono: Aritza - Lógica pura del juego (sin DOM).
// Plataformas laterales con coordenadas lógicas: altura fija 800 y anchura
// dinámica según pantalla. La heroína se mueve en coordenadas de mundo y la
// cámara la sigue horizontalmente.

export const LOGICAL_HEIGHT = 800;
export const GROUND_Y = 660;
export const UNITS_PER_METER = 10;
export const MAX_HEARTS = 6;

export const PLAYER = {
  w: 46,
  h: 66,
  accel: 2400,
  airAccel: 1750,
  maxSpeed: 330,
  friction: 2600,
  airFriction: 900,
  gravity: 2750,
  gravityRelease: 6000,
  maxFall: 1750,
  jumpVelocity: -1040,
  coyoteTime: 0.1,
  jumpBufferTime: 0.12,
  maxHearts: 3,
  invulnerableTime: 1.4,
  stompBounce: -650,
};

export const ENEMY_DEFS = {
  goblin: { w: 46, h: 54, speed: 76, score: 25, hp: 1 },
  bat: { w: 46, h: 30, speed: 98, score: 30, hp: 1 },
  archer: { w: 44, h: 56, speed: 42, score: 35, hp: 1, shoots: true },
  golem: { w: 62, h: 74, speed: 36, score: 60, hp: 3, coinDrop: 3 },
  skeleton: { w: 48, h: 58, speed: 64, score: 45, hp: 2, hops: true, coinDrop: 2 },
  fire_snake: { w: 52, h: 36, speed: 44, score: 50, hp: 2, spitsFire: true, spikeTop: true, coinDrop: 2 },
  worm: { w: 42, h: 22, speed: 38, score: 30, hp: 1, coinDrop: 1 },
  gargantua: { w: 74, h: 88, speed: 32, score: 90, hp: 4, coinDrop: 5, giant: true },
  basajaun: { w: 64, h: 78, speed: 48, score: 80, hp: 3, coinDrop: 4, hops: true },
  tartalo: { w: 66, h: 76, speed: 40, score: 75, hp: 3, coinDrop: 3, eyeLaser: true },
  iratxo: { w: 38, h: 42, speed: 92, score: 40, hp: 1, hops: true, coinDrop: 2 },
};

export const HEROES = {
  jainvs: {
    id: 'jainvs',
    nombre: 'Jainvs',
    tipo: 'heroina',
    skin: '#f2c9a0',
    hair: '#d4a84b',
    tunic: '#8f2f8f',
    tunicDark: '#6a1f6a',
    hairStyle: 'long',
    hasDiadem: true,
    diademColor: '#ff9fdf',
  },
  jvlivs: {
    id: 'jvlivs',
    nombre: 'Jvlivs',
    tipo: 'heroe',
    skin: '#d4956a',
    hair: '#2a1a0a',
    tunic: '#2f4f8f',
    tunicDark: '#1a2f5a',
    hairStyle: 'short',
    hasDiadem: false,
    diademColor: null,
  },
  aritza: {
    id: 'aritza',
    nombre: 'Aritza',
    tipo: 'ambos',
    skin: '#f2c9a0',
    hair: '#7a3b1e',
    tunic: '#2f7f86',
    tunicDark: '#22636a',
    hairStyle: 'medium',
    hasDiadem: true,
    diademColor: '#a5d8ff',
  },
};

export const THEMES = [
  {
    nombre: 'San Pedro de Deusto',
    lema: 'La ribera de la sabiduría',
    sky: ["#7fb7d9", "#e6f3ff"],
    far: '#8fb3c9',
    mid: '#4f7f9e',
    near: '#2e4e63',
    ground: '#3e4a52',
    groundTop: '#7fa6a8',
    stone: '#5f7f8f',
    stoneTop: '#9fc4c8',
    accent: '#f2d27a',
    sun: '#fff7d6',
    cloud: '#ffffff',
  },
  {
    nombre: 'Arangoiti',
    lema: 'El balcón verde sobre la ría',
    sky: ["#79b4c9", "#e9f2d8"],
    far: '#a3bd8c',
    mid: '#5c7d5b',
    near: '#2f4a35',
    ground: '#4a3a2a',
    groundTop: '#6f9a4a',
    stone: '#6b6350',
    stoneTop: '#8fae6a',
    accent: '#e7c15a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Ibarrekolanda',
    lema: 'Encrucijada viva del Botxo',
    sky: ["#7fb7d9", "#e6f3ff"],
    far: '#8fb3c9',
    mid: '#4f7f9e',
    near: '#2e4e63',
    ground: '#3e4a52',
    groundTop: '#7fa6a8',
    stone: '#5f7f8f',
    stoneTop: '#9fc4c8',
    accent: '#f2d27a',
    sun: '#fff7d6',
    cloud: '#ffffff',
  },
  {
    nombre: 'San Ignacio',
    lema: 'Corazón obrero y alegre',
    sky: ["#7f8f9f", "#d9dde0"],
    far: '#8f9aa5',
    mid: '#5f6f7a',
    near: '#3a4650',
    ground: '#3a3a3a',
    groundTop: '#8f6a3e',
    stone: '#5f5a50',
    stoneTop: '#8f7a5f',
    accent: '#e08a4a',
    sun: '#f0e0c0',
    cloud: '#e6eef5',
  },
  {
    nombre: 'Elorrieta',
    lema: 'El confín de los tranvías',
    sky: ["#8fa9c6", "#dfe8f2"],
    far: '#9aa9b8',
    mid: '#5c6f84',
    near: '#38465a',
    ground: '#4a4842',
    groundTop: '#7b7a6e',
    stone: '#6a675d',
    stoneTop: '#8f8c7f',
    accent: '#d9c37a',
    sun: '#f7ecc4',
    cloud: '#f4f7fb',
  },
  {
    nombre: 'Zorrotzaurre',
    lema: 'La isla del futuro y la vanguardia',
    sky: ["#7fb7d9", "#e6f3ff"],
    far: '#8fb3c9',
    mid: '#4f7f9e',
    near: '#2e4e63',
    ground: '#3e4a52',
    groundTop: '#7fa6a8',
    stone: '#5f7f8f',
    stoneTop: '#9fc4c8',
    accent: '#f2d27a',
    sun: '#fff7d6',
    cloud: '#ffffff',
  },
  {
    nombre: 'Ribera de Deusto',
    lema: 'Salitre, talleres y alma fluvial',
    sky: ["#7f8f9f", "#d9dde0"],
    far: '#8f9aa5',
    mid: '#5f6f7a',
    near: '#3a4650',
    ground: '#3a3a3a',
    groundTop: '#8f6a3e',
    stone: '#5f5a50',
    stoneTop: '#8f7a5f',
    accent: '#e08a4a',
    sun: '#f0e0c0',
    cloud: '#e6eef5',
  },
  {
    nombre: 'Uribarri',
    lema: 'La cuesta hacia los cielos',
    sky: ["#d98a6a", "#ffe0b0"],
    far: '#c98a6a',
    mid: '#8f5f4a',
    near: '#5a3a35',
    ground: '#3e2c26',
    groundTop: '#a06a3e',
    stone: '#6a4f3e',
    stoneTop: '#a07a4f',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Matiko',
    lema: 'Pasadizo entre túneles y plazuelas',
    sky: ["#8fa9c6", "#dfe8f2"],
    far: '#9aa9b8',
    mid: '#5c6f84',
    near: '#38465a',
    ground: '#4a4842',
    groundTop: '#7b7a6e',
    stone: '#6a675d',
    stoneTop: '#8f8c7f',
    accent: '#d9c37a',
    sun: '#f7ecc4',
    cloud: '#f4f7fb',
  },
  {
    nombre: 'Ciudad Jardín',
    lema: 'El oasis de tejas rojas',
    sky: ["#79b4c9", "#e9f2d8"],
    far: '#a3bd8c',
    mid: '#5c7d5b',
    near: '#2f4a35',
    ground: '#4a3a2a',
    groundTop: '#6f9a4a',
    stone: '#6b6350',
    stoneTop: '#8fae6a',
    accent: '#e7c15a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Castaños',
    lema: 'Sombra apacible al pie del funicular',
    sky: ["#9cc9a8", "#f2f0cf"],
    far: '#a8c99b',
    mid: '#5f8f5a',
    near: '#365a3b',
    ground: '#4a3a2a',
    groundTop: '#7fa34a',
    stone: '#6b7f50',
    stoneTop: '#9fbf6a',
    accent: '#f0d27a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Zurbaran',
    lema: 'Escaleras que abrazan la ladera',
    sky: ["#d98a6a", "#ffe0b0"],
    far: '#c98a6a',
    mid: '#8f5f4a',
    near: '#5a3a35',
    ground: '#3e2c26',
    groundTop: '#a06a3e',
    stone: '#6a4f3e',
    stoneTop: '#a07a4f',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Arabella',
    lema: 'Viento fresco de las alturas',
    sky: ["#a9cbe6", "#eef6ff"],
    far: '#c3d6e6',
    mid: '#8ba6bf',
    near: '#5a7186',
    ground: '#3c4a58',
    groundTop: '#e6eef5',
    stone: '#8296a8',
    stoneTop: '#e6eef5',
    accent: '#a5d8ff',
    sun: '#ffffff',
    cloud: '#ffffff',
  },
  {
    nombre: 'Artxanda',
    lema: 'El mirador que guarda el reino',
    sky: ["#79b4c9", "#e9f2d8"],
    far: '#a3bd8c',
    mid: '#5c7d5b',
    near: '#2f4a35',
    ground: '#4a3a2a',
    groundTop: '#6f9a4a',
    stone: '#6b6350',
    stoneTop: '#8fae6a',
    accent: '#e7c15a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Otxarkoaga',
    lema: 'Pueblo forjado en mil colinas',
    sky: ["#7f8f9f", "#d9dde0"],
    far: '#8f9aa5',
    mid: '#5f6f7a',
    near: '#3a4650',
    ground: '#3a3a3a',
    groundTop: '#8f6a3e',
    stone: '#5f5a50',
    stoneTop: '#8f7a5f',
    accent: '#e08a4a',
    sun: '#f0e0c0',
    cloud: '#e6eef5',
  },
  {
    nombre: 'Txurdinaga',
    lema: 'Parques abiertos donde corre la brisa',
    sky: ["#9cc9a8", "#f2f0cf"],
    far: '#a8c99b',
    mid: '#5f8f5a',
    near: '#365a3b',
    ground: '#4a3a2a',
    groundTop: '#7fa34a',
    stone: '#6b7f50',
    stoneTop: '#9fbf6a',
    accent: '#f0d27a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Begoña',
    lema: 'Campanas y devoción sobre la villa',
    sky: ["#9cc9a8", "#f2f0cf"],
    far: '#a8c99b',
    mid: '#5f8f5a',
    near: '#365a3b',
    ground: '#4a3a2a',
    groundTop: '#7fa34a',
    stone: '#6b7f50',
    stoneTop: '#9fbf6a',
    accent: '#f0d27a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Santutxu',
    lema: 'El laberinto más vivo del pueblo',
    sky: ["#d98a6a", "#ffe0b0"],
    far: '#c98a6a',
    mid: '#8f5f4a',
    near: '#5a3a35',
    ground: '#3e2c26',
    groundTop: '#a06a3e',
    stone: '#6a4f3e',
    stoneTop: '#a07a4f',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Bolueta',
    lema: 'Chimeneas antiguas junto al cauce',
    sky: ["#7f8f9f", "#d9dde0"],
    far: '#8f9aa5',
    mid: '#5f6f7a',
    near: '#3a4650',
    ground: '#3a3a3a',
    groundTop: '#8f6a3e',
    stone: '#5f5a50',
    stoneTop: '#8f7a5f',
    accent: '#e08a4a',
    sun: '#f0e0c0',
    cloud: '#e6eef5',
  },
  {
    nombre: 'Zazpikaleak',
    lema: 'Siete calles, siete secretos',
    sky: ["#8fa9c6", "#dfe8f2"],
    far: '#9aa9b8',
    mid: '#5c6f84',
    near: '#38465a',
    ground: '#4a4842',
    groundTop: '#7b7a6e',
    stone: '#6a675d',
    stoneTop: '#8f8c7f',
    accent: '#d9c37a',
    sun: '#f7ecc4',
    cloud: '#f4f7fb',
  },
  {
    nombre: 'Casco Viejo',
    lema: 'El origen de todas las leyendas',
    sky: ["#8fa9c6", "#dfe8f2"],
    far: '#9aa9b8',
    mid: '#5c6f84',
    near: '#38465a',
    ground: '#4a4842',
    groundTop: '#7b7a6e',
    stone: '#6a675d',
    stoneTop: '#8f8c7f',
    accent: '#d9c37a',
    sun: '#f7ecc4',
    cloud: '#f4f7fb',
  },
  {
    nombre: 'Bilbao La Vieja',
    lema: 'Piedra noble y arte rebelde',
    sky: ["#e98a5e", "#ffe4b5"],
    far: '#c47a5f',
    mid: '#8a4f45',
    near: '#573438',
    ground: '#3e2c26',
    groundTop: '#8a6a3e',
    stone: '#5b4636',
    stoneTop: '#8a6a3e',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'San Francisco',
    lema: 'Colores y aromas de todo el orbe',
    sky: ["#d98a6a", "#ffe0b0"],
    far: '#c98a6a',
    mid: '#8f5f4a',
    near: '#5a3a35',
    ground: '#3e2c26',
    groundTop: '#a06a3e',
    stone: '#6a4f3e',
    stoneTop: '#a07a4f',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Zabala',
    lema: 'Calles férreas al cobijo del tren',
    sky: ["#7f8f9f", "#d9dde0"],
    far: '#8f9aa5',
    mid: '#5f6f7a',
    near: '#3a4650',
    ground: '#3a3a3a',
    groundTop: '#8f6a3e',
    stone: '#5f5a50',
    stoneTop: '#8f7a5f',
    accent: '#e08a4a',
    sun: '#f0e0c0',
    cloud: '#e6eef5',
  },
  {
    nombre: 'Atxuri',
    lema: 'La vieja estación que mira a los montes',
    sky: ["#e98a5e", "#ffe4b5"],
    far: '#c47a5f',
    mid: '#8a4f45',
    near: '#573438',
    ground: '#3e2c26',
    groundTop: '#8a6a3e',
    stone: '#5b4636',
    stoneTop: '#8a6a3e',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Iturralde',
    lema: 'Fuentes tranquilas junto al Casco',
    sky: ["#8fa9c6", "#dfe8f2"],
    far: '#9aa9b8',
    mid: '#5c6f84',
    near: '#38465a',
    ground: '#4a4842',
    groundTop: '#7b7a6e',
    stone: '#6a675d',
    stoneTop: '#8f8c7f',
    accent: '#d9c37a',
    sun: '#f7ecc4',
    cloud: '#f4f7fb',
  },
  {
    nombre: 'Solokoetxe',
    lema: 'Espinazo de peldaños infinitos',
    sky: ["#d98a6a", "#ffe0b0"],
    far: '#c98a6a',
    mid: '#8f5f4a',
    near: '#5a3a35',
    ground: '#3e2c26',
    groundTop: '#a06a3e',
    stone: '#6a4f3e',
    stoneTop: '#a07a4f',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'La Peña',
    lema: 'Agua brava bajo las peñas',
    sky: ["#7fb7d9", "#e6f3ff"],
    far: '#8fb3c9',
    mid: '#4f7f9e',
    near: '#2e4e63',
    ground: '#3e4a52',
    groundTop: '#7fa6a8',
    stone: '#5f7f8f',
    stoneTop: '#9fc4c8',
    accent: '#f2d27a',
    sun: '#fff7d6',
    cloud: '#ffffff',
  },
  {
    nombre: 'Miribilla',
    lema: 'La cumbre de hierro y miradores',
    sky: ["#a9cbe6", "#eef6ff"],
    far: '#c3d6e6',
    mid: '#8ba6bf',
    near: '#5a7186',
    ground: '#3c4a58',
    groundTop: '#e6eef5',
    stone: '#8296a8',
    stoneTop: '#e6eef5',
    accent: '#a5d8ff',
    sun: '#ffffff',
    cloud: '#ffffff',
  },
  {
    nombre: 'San Adrián',
    lema: 'Vergel y calma junto al arroyo',
    sky: ["#79b4c9", "#e9f2d8"],
    far: '#a3bd8c',
    mid: '#5c7d5b',
    near: '#2f4a35',
    ground: '#4a3a2a',
    groundTop: '#6f9a4a',
    stone: '#6b6350',
    stoneTop: '#8fae6a',
    accent: '#e7c15a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Mina del Morro',
    lema: 'Ecos subterráneos de mineros',
    sky: ["#7f8f9f", "#d9dde0"],
    far: '#8f9aa5',
    mid: '#5f6f7a',
    near: '#3a4650',
    ground: '#3a3a3a',
    groundTop: '#8f6a3e',
    stone: '#5f5a50',
    stoneTop: '#8f7a5f',
    accent: '#e08a4a',
    sun: '#f0e0c0',
    cloud: '#e6eef5',
  },
  {
    nombre: 'Abando',
    lema: 'El corazón dorado de Bilbao',
    sky: ["#e98a5e", "#ffe4b5"],
    far: '#c47a5f',
    mid: '#8a4f45',
    near: '#573438',
    ground: '#3e2c26',
    groundTop: '#8a6a3e',
    stone: '#5b4636',
    stoneTop: '#8a6a3e',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Indautxu',
    lema: 'Elegancia, terrazas y bullicio',
    sky: ["#e98a5e", "#ffe4b5"],
    far: '#c47a5f',
    mid: '#8a4f45',
    near: '#573438',
    ground: '#3e2c26',
    groundTop: '#8a6a3e',
    stone: '#5b4636',
    stoneTop: '#8a6a3e',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Albia',
    lema: 'Jardines de sombra y pláticas sabias',
    sky: ["#9cc9a8", "#f2f0cf"],
    far: '#a8c99b',
    mid: '#5f8f5a',
    near: '#365a3b',
    ground: '#4a3a2a',
    groundTop: '#7fa34a',
    stone: '#6b7f50',
    stoneTop: '#9fbf6a',
    accent: '#f0d27a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Guggenheim - Ensanche',
    lema: 'Titanio brillante junto al agua',
    sky: ["#a9cbe6", "#eef6ff"],
    far: '#c3d6e6',
    mid: '#8ba6bf',
    near: '#5a7186',
    ground: '#3c4a58',
    groundTop: '#e6eef5',
    stone: '#8296a8',
    stoneTop: '#e6eef5',
    accent: '#a5d8ff',
    sun: '#ffffff',
    cloud: '#ffffff',
  },
  {
    nombre: 'Campuzano',
    lema: 'Fuente serena del buen compás',
    sky: ["#e98a5e", "#ffe4b5"],
    far: '#c47a5f',
    mid: '#8a4f45',
    near: '#573438',
    ground: '#3e2c26',
    groundTop: '#8a6a3e',
    stone: '#5b4636',
    stoneTop: '#8a6a3e',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Errekaldeberri',
    lema: 'Fuerza vecinal y orgullo de barrio',
    sky: ["#7f8f9f", "#d9dde0"],
    far: '#8f9aa5',
    mid: '#5f6f7a',
    near: '#3a4650',
    ground: '#3a3a3a',
    groundTop: '#8f6a3e',
    stone: '#5f5a50',
    stoneTop: '#8f7a5f',
    accent: '#e08a4a',
    sun: '#f0e0c0',
    cloud: '#e6eef5',
  },
  {
    nombre: 'Larraskitu',
    lema: 'Valle escondido entre robles',
    sky: ["#79b4c9", "#e9f2d8"],
    far: '#a3bd8c',
    mid: '#5c7d5b',
    near: '#2f4a35',
    ground: '#4a3a2a',
    groundTop: '#6f9a4a',
    stone: '#6b6350',
    stoneTop: '#8fae6a',
    accent: '#e7c15a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Iturrigorri - Peñascal',
    lema: 'Fuente roja al pie del precipicio',
    sky: ["#d98a6a", "#ffe0b0"],
    far: '#c98a6a',
    mid: '#8f5f4a',
    near: '#5a3a35',
    ground: '#3e2c26',
    groundTop: '#a06a3e',
    stone: '#6a4f3e',
    stoneTop: '#a07a4f',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Betolaza',
    lema: 'Atalaya sobre los tejados',
    sky: ["#a9cbe6", "#eef6ff"],
    far: '#c3d6e6',
    mid: '#8ba6bf',
    near: '#5a7186',
    ground: '#3c4a58',
    groundTop: '#e6eef5',
    stone: '#8296a8',
    stoneTop: '#e6eef5',
    accent: '#a5d8ff',
    sun: '#ffffff',
    cloud: '#ffffff',
  },
  {
    nombre: 'Uretamendi',
    lema: 'Monte de aguas y horizonte amplio',
    sky: ["#79b4c9", "#e9f2d8"],
    far: '#a3bd8c',
    mid: '#5c7d5b',
    near: '#2f4a35',
    ground: '#4a3a2a',
    groundTop: '#6f9a4a',
    stone: '#6b6350',
    stoneTop: '#8fae6a',
    accent: '#e7c15a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Ametzola',
    lema: 'El parque donde antes silbaban trenes',
    sky: ["#9cc9a8", "#f2f0cf"],
    far: '#a8c99b',
    mid: '#5f8f5a',
    near: '#365a3b',
    ground: '#4a3a2a',
    groundTop: '#7fa34a',
    stone: '#6b7f50',
    stoneTop: '#9fbf6a',
    accent: '#f0d27a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Iralabarri',
    lema: 'Casas de harina y colores británicos',
    sky: ["#e98a5e", "#ffe4b5"],
    far: '#c47a5f',
    mid: '#8a4f45',
    near: '#573438',
    ground: '#3e2c26',
    groundTop: '#8a6a3e',
    stone: '#5b4636',
    stoneTop: '#8a6a3e',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Basurto',
    lema: 'Puerta hospitalaria y guardiana',
    sky: ["#7f8f9f", "#d9dde0"],
    far: '#8f9aa5',
    mid: '#5f6f7a',
    near: '#3a4650',
    ground: '#3a3a3a',
    groundTop: '#8f6a3e',
    stone: '#5f5a50',
    stoneTop: '#8f7a5f',
    accent: '#e08a4a',
    sun: '#f0e0c0',
    cloud: '#e6eef5',
  },
  {
    nombre: 'San Mamés',
    lema: 'La catedral del rugido eterno',
    sky: ["#e98a5e", "#ffe4b5"],
    far: '#c47a5f',
    mid: '#8a4f45',
    near: '#573438',
    ground: '#3e2c26',
    groundTop: '#8a6a3e',
    stone: '#5b4636',
    stoneTop: '#8a6a3e',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Altamira',
    lema: 'Mirada alta que domina la ría',
    sky: ["#a9cbe6", "#eef6ff"],
    far: '#c3d6e6',
    mid: '#8ba6bf',
    near: '#5a7186',
    ground: '#3c4a58',
    groundTop: '#e6eef5',
    stone: '#8296a8',
    stoneTop: '#e6eef5',
    accent: '#a5d8ff',
    sun: '#ffffff',
    cloud: '#ffffff',
  },
  {
    nombre: 'Masustegi',
    lema: 'Casas en cuesta construidas a mano',
    sky: ["#d98a6a", "#ffe0b0"],
    far: '#c98a6a',
    mid: '#8f5f4a',
    near: '#5a3a35',
    ground: '#3e2c26',
    groundTop: '#a06a3e',
    stone: '#6a4f3e',
    stoneTop: '#a07a4f',
    accent: '#ffd166',
    sun: '#ffd79a',
    cloud: '#ffe9cf',
  },
  {
    nombre: 'Monte Caramelo',
    lema: 'Rampa empinada hacia las nubes',
    sky: ["#79b4c9", "#e9f2d8"],
    far: '#a3bd8c',
    mid: '#5c7d5b',
    near: '#2f4a35',
    ground: '#4a3a2a',
    groundTop: '#6f9a4a',
    stone: '#6b6350',
    stoneTop: '#8fae6a',
    accent: '#e7c15a',
    sun: '#fff4c9',
    cloud: '#ffffff',
  },
  {
    nombre: 'Olabeaga',
    lema: 'Noruega botxera frente a los barcos',
    sky: ["#7fb7d9", "#e6f3ff"],
    far: '#8fb3c9',
    mid: '#4f7f9e',
    near: '#2e4e63',
    ground: '#3e4a52',
    groundTop: '#7fa6a8',
    stone: '#5f7f8f',
    stoneTop: '#9fc4c8',
    accent: '#f2d27a',
    sun: '#fff7d6',
    cloud: '#ffffff',
  },
  {
    nombre: 'Zorrotza',
    lema: 'Punta afilada donde se unen los ríos',
    sky: ["#7fb7d9", "#e6f3ff"],
    far: '#8fb3c9',
    mid: '#4f7f9e',
    near: '#2e4e63',
    ground: '#3e4a52',
    groundTop: '#7fa6a8',
    stone: '#5f7f8f',
    stoneTop: '#9fc4c8',
    accent: '#f2d27a',
    sun: '#fff7d6',
    cloud: '#ffffff',
  },
  {
    nombre: 'Kastrexana',
    lema: 'El puente del diablo en la calzada',
    sky: ["#8fa9c6", "#dfe8f2"],
    far: '#9aa9b8',
    mid: '#5c6f84',
    near: '#38465a',
    ground: '#4a4842',
    groundTop: '#7b7a6e',
    stone: '#6a675d',
    stoneTop: '#8f8c7f',
    accent: '#d9c37a',
    sun: '#f7ecc4',
    cloud: '#f4f7fb',
  },
  {
    nombre: 'Gurtubay',
    lema: 'El rincón del bacalao legendario',
    sky: ["#8fa9c6", "#dfe8f2"],
    far: '#9aa9b8',
    mid: '#5c6f84',
    near: '#38465a',
    ground: '#4a4842',
    groundTop: '#7b7a6e',
    stone: '#6a675d',
    stoneTop: '#8f8c7f',
    accent: '#d9c37a',
    sun: '#f7ecc4',
    cloud: '#f4f7fb',
  },
];

// Distancia horizontal máxima aproximada de un salto a velocidad punta.
export const MAX_JUMP_DISTANCE =
  (PLAYER.maxSpeed * 2 * Math.abs(PLAYER.jumpVelocity)) / PLAYER.gravity;

// Catálogo de la DENDA. Los precios se ajustan durante el equilibrio.
export const SHOP_ITEMS = {
  pintxo_tortilla: {
    id: 'pintxo_tortilla',
    category: 'pintxo',
    nombre: 'Pintxo de tortilla',
    desc: 'Cura 2 corazones.',
    price: 5,
    effect: 'heal',
    value: 2,
    icon: '🍳',
  },
  pintxo_txistorra: {
    id: 'pintxo_txistorra',
    category: 'pintxo',
    nombre: 'Pintxo de txistorra',
    desc: '+10 % de velocidad.',
    price: 6,
    effect: 'speed',
    value: 0.1,
    icon: '🌭',
  },
  pintxo_pimiento: {
    id: 'pintxo_pimiento',
    category: 'pintxo',
    nombre: 'Pintxo de pimiento',
    desc: '+10 % de altura de salto.',
    price: 6,
    effect: 'jump',
    value: 0.1,
    icon: '🫑',
  },
  pintxo_anchoas: {
    id: 'pintxo_anchoas',
    category: 'pintxo',
    nombre: 'Pintxo de anchoas',
    desc: 'Atrae las monedas cercanas.',
    price: 8,
    effect: 'magnet',
    value: 1,
    icon: '🐟',
  },
  pintxo_queso: {
    id: 'pintxo_queso',
    category: 'pintxo',
    nombre: 'Pintxo de queso',
    desc: '+1 carga de escudo.',
    price: 8,
    effect: 'shieldCharge',
    value: 1,
    icon: '🧀',
  },
  pintxo_morcilla: {
    id: 'pintxo_morcilla',
    category: 'pintxo',
    nombre: 'Pintxo de morcilla',
    desc: '+1 daño de espada.',
    price: 9,
    effect: 'swordDamage',
    value: 1,
    icon: '🥘',
  },
  pintxo_bacalao: {
    id: 'pintxo_bacalao',
    category: 'pintxo',
    nombre: 'Pintxo de bacalao',
    desc: '+1 corazón máximo y cura 1.',
    price: 10,
    effect: 'maxHeart',
    value: 1,
    icon: '🐠',
  },
  pintxo_pulpo: {
    id: 'pintxo_pulpo',
    category: 'pintxo',
    nombre: 'Pintxo de pulpo',
    desc: 'Las flechas perforan 1 enemigo.',
    price: 10,
    effect: 'pierce',
    value: 1,
    icon: '🐙',
  },
  pintxo_bonito: {
    id: 'pintxo_bonito',
    category: 'pintxo',
    nombre: 'Pintxo de bonito',
    desc: 'Los puñales salen en abanico.',
    price: 10,
    effect: 'daggerFan',
    value: 1,
    icon: '🐟',
  },
  pintxo_txampis: {
    id: 'pintxo_txampis',
    category: 'pintxo',
    nombre: 'Pintxo de txampis',
    desc: 'Desbloquea el doble salto.',
    price: 12,
    effect: 'doubleJump',
    value: 1,
    icon: '🍄',
  },
  pocima_vida: {
    id: 'pocima_vida',
    category: 'pocima',
    nombre: 'Poción de vida',
    desc: 'Recarga todos los corazones.',
    price: 8,
    effect: 'fullHeal',
    value: 1,
    icon: '🧪',
  },
  pocima_hielo: {
    id: 'pocima_hielo',
    category: 'pocima',
    nombre: 'Poción de hielo',
    desc: 'Tus proyectiles ralentizan enemigos.',
    price: 10,
    effect: 'ice',
    value: 1,
    icon: '❄️',
  },
  pocima_fuerza: {
    id: 'pocima_fuerza',
    category: 'pocima',
    nombre: 'Poción de fuerza',
    desc: '+1 daño de espada y proyectiles.',
    price: 12,
    effect: 'damage',
    value: 1,
    icon: '💪',
  },
  pocima_piedra: {
    id: 'pocima_piedra',
    category: 'pocima',
    nombre: 'Poción de piedra',
    desc: 'Escudo frontal y +0,4 s de invulnerabilidad.',
    price: 12,
    effect: 'shield',
    value: 1,
    icon: '🛡️',
  },
  pocima_fuego: {
    id: 'pocima_fuego',
    category: 'pocima',
    nombre: 'Poción de fuego',
    desc: '+1 daño de flechas y puñales.',
    price: 12,
    effect: 'rangedDamage',
    value: 1,
    icon: '🔥',
  },
  pocima_corazon: {
    id: 'pocima_corazon',
    category: 'pocima',
    nombre: 'Poción de corazón',
    desc: '+1 corazón máximo y recarga todo.',
    price: 14,
    effect: 'maxHeartFull',
    value: 1,
    icon: '❤️',
  },
  pocima_salto: {
    id: 'pocima_salto',
    category: 'pocima',
    nombre: 'Poción de salto',
    desc: 'Desbloquea el doble salto.',
    price: 14,
    effect: 'doubleJump',
    value: 1,
    icon: '🪽',
  },
  pocima_viento: {
    id: 'pocima_viento',
    category: 'pocima',
    nombre: 'Poción de viento',
    desc: 'Desbloquea el dash.',
    price: 14,
    effect: 'dash',
    value: 1,
    icon: '💨',
  },
  pocima_oro: {
    id: 'pocima_oro',
    category: 'pocima',
    nombre: 'Poción de oro',
    desc: '+1 moneda por cada moneda recogida.',
    price: 15,
    effect: 'coinBonus',
    value: 1,
    icon: '🪙',
  },
  equipo_iman: {
    id: 'equipo_iman',
    category: 'equipo',
    nombre: 'Imán de monedas',
    desc: 'Atrae monedas a distancia.',
    price: 9,
    effect: 'magnet',
    value: 1,
    icon: '🧲',
  },
  equipo_botas: {
    id: 'equipo_botas',
    category: 'equipo',
    nombre: 'Botas de salto',
    desc: '+12 % de altura de salto.',
    price: 10,
    effect: 'jump',
    value: 0.12,
    icon: '🥾',
  },
  equipo_capa: {
    id: 'equipo_capa',
    category: 'equipo',
    nombre: 'Capa del Botxo',
    desc: '+10 % de altura de salto.',
    price: 14,
    effect: 'cape',
    value: 1,
    icon: '🧣',
  },
  equipo_escudo_nervion: {
    id: 'equipo_escudo_nervion',
    category: 'equipo',
    nombre: 'Escudo del Nervión',
    desc: 'Absorbe 3 impactos (escudo con cargas).',
    price: 16,
    effect: 'shield',
    value: 3,
    icon: '🛡️',
  },
  equipo_armadura: {
    id: 'equipo_armadura',
    category: 'equipo',
    nombre: 'Armadura del Botxo',
    desc: 'Absorbe 5 impactos. Requiere capa y escudo.',
    price: 32,
    effect: 'armor',
    value: 5,
    icon: '🪖',
  },
  equipo_corazon: {
    id: 'equipo_corazon',
    category: 'equipo',
    nombre: 'Corazón extra',
    desc: '+1 corazón máximo.',
    price: 12,
    effect: 'maxHeart',
    value: 1,
    icon: '❤️',
  },
  equipo_punales_traidores: {
    id: 'equipo_punales_traidores',
    category: 'equipo',
    nombre: 'Puñales traicioneros',
    desc: 'Proyectil rápido y de corto alcance.',
    price: 14,
    effect: 'daggers',
    value: 1,
    icon: '🗡️',
  },
  equipo_espada_nervion: {
    id: 'equipo_espada_nervion',
    category: 'equipo',
    nombre: 'Espada larga del Nervión',
    desc: 'Ataque cuerpo a cuerpo de largo alcance.',
    price: 20,
    effect: 'longSword',
    value: 1,
    icon: '⚔️',
  },
  equipo_arco_corazon: {
    id: 'equipo_arco_corazon',
    category: 'equipo',
    nombre: 'Arco con flechas en tu corazón',
    desc: 'Proyectil lento y de largo alcance.',
    price: 18,
    effect: 'bow',
    value: 1,
    icon: '🏹',
  },
  equipo_doble_salto: {
    id: 'equipo_doble_salto',
    category: 'equipo',
    nombre: 'Doble salto',
    desc: 'Un salto extra en el aire.',
    price: 20,
    effect: 'doubleJump',
    value: 1,
    icon: '🪽',
  },
  equipo_amuleto: {
    id: 'equipo_amuleto',
    category: 'equipo',
    nombre: 'Amuleto del Botxo',
    desc: 'Revive una vez con 2 corazones.',
    price: 28,
    effect: 'revive',
    value: 1,
    icon: '📿',
  },
};

const SHOP_BY_CATEGORY = {
  pintxo: Object.values(SHOP_ITEMS).filter((item) => item.category === 'pintxo'),
  pocima: Object.values(SHOP_ITEMS).filter((item) => item.category === 'pocima'),
  equipo: Object.values(SHOP_ITEMS).filter((item) => item.category === 'equipo'),
};

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function groundPlatform(x, w) {
  return { x, y: GROUND_Y, w, h: LOGICAL_HEIGHT - GROUND_Y, type: 'ground' };
}

function makeCoin(x, y) {
  return { x, y, w: 26, h: 26, collected: false };
}

function makeEnemy(type, x, lineY, minX, maxX, rng, level = 1) {
  const def = ENEMY_DEFS[type] || ENEMY_DEFS.goblin;
  const dir = rng() < 0.5 ? -1 : 1;
  const speedMult = Math.min(1.6, 1 + (level - 1) * 0.015);
  const hpBonus = level >= 25 && (def.hp || 1) >= 2 ? 1 : 0;
  const finalHp = (def.hp || 1) + hpBonus;
  return {
    type,
    x,
    y: type === 'bat' ? lineY : lineY - def.h,
    vy: 0,
    baseY: lineY,
    w: def.w,
    h: def.h,
    vx: def.speed * speedMult * dir,
    patrolDir: dir,
    minX,
    maxX,
    alive: true,
    phase: rng() * Math.PI * 2,
    score: def.score,
    hp: finalHp,
    maxHp: finalHp,
    facing: dir,
    shootCooldown: def.shoots || def.spitsFire ? (0.7 + rng() * 0.9) * Math.max(0.65, 1 - (level - 1) * 0.01) : 0,
    hopTimer: def.hops ? 1.0 + rng() * 1.2 : 0,
    windup: 0,
    aiming: false,
    hitFlash: 0,
    slowTimer: 0,
    coinDrop: def.coinDrop || 0,
  };
}

function makeDenda(x, y) {
  return {
    x,
    y,
    w: 150,
    h: 116,
    trigger: { x: x - 70, y: GROUND_Y - 160, w: 290, h: 170 },
    visited: false,
    healed: false,
    inside: false,
    offers: null,
  };
}

function addDenda(platform, rng) {
  const dendaX = platform.x + platform.w / 2 - 75;
  return makeDenda(dendaX, GROUND_Y - 116);
}

// Genera un nivel determinista con un rng dado.
export function createLevel(levelNumber = 1, rng = Math.random) {
  const level = Math.max(1, Math.floor(levelNumber));
  const themeIndex = (level - 1) % THEMES.length;
  const targetLength = 4200 + level * 700;

  const platforms = [];
  const coins = [];
  const enemies = [];
  const hazards = [];
  let denda = null;
  let dendaPlaced = false;
  const dendaTarget = targetLength * 0.5;

  const startWidth = 720;
  platforms.push(groundPlatform(0, startWidth));
  let x = startWidth;

  const finalReserve = 1100;
  while (x < targetLength - finalReserve) {
    const maxGap = Math.min(190, 110 + level * 6);
    const gap = 100 + rng() * (maxGap - 100);
    x += gap;

    const dendaSegment = !dendaPlaced && x >= dendaTarget;
    const width = dendaSegment ? 620 + rng() * 90 : 320 + rng() * 340;
    const platform = groundPlatform(x, width);
    platforms.push(platform);

    if (dendaSegment) {
      denda = addDenda(platform, rng);
      dendaPlaced = true;
      for (let i = 0; i < 5; i += 1) {
        coins.push(makeCoin(denda.x - 130 + i * 32, GROUND_Y - 58));
      }
      for (let i = 0; i < 4; i += 1) {
        coins.push(makeCoin(denda.x + denda.w + 40 + i * 32, GROUND_Y - 58));
      }
    } else {
      if (rng() > 0.35 && width > 380) {
        const ledgeW = 110 + rng() * 110;
        const ledgeX = x + 60 + rng() * Math.max(20, width - ledgeW - 120);
        const ledgeY = GROUND_Y - 120 - rng() * 60;
        platforms.push({
          x: ledgeX,
          y: ledgeY,
          w: ledgeW,
          h: 26,
          type: 'ledge',
        });
        const ledgeCoins = 2 + Math.floor(rng() * 3);
        for (let i = 0; i < ledgeCoins; i += 1) {
          coins.push(makeCoin(ledgeX + 22 + i * 30, ledgeY - 38));
        }
        if (rng() > 0.55) {
          const ledge2W = 90 + rng() * 80;
          const ledge2X = x + 40 + rng() * Math.max(20, width - ledge2W - 80);
          const ledge2Y = GROUND_Y - 230 - rng() * 50;
          platforms.push({
            x: ledge2X,
            y: ledge2Y,
            w: ledge2W,
            h: 26,
            type: 'ledge',
          });
          for (let i = 0; i < 3; i += 1) {
            coins.push(makeCoin(ledge2X + 18 + i * 30, ledge2Y - 36));
          }
          if (rng() > 0.45) {
            const towerW = 80 + rng() * 70;
            const towerX = x + 50 + rng() * Math.max(20, width - towerW - 80);
            const towerY = GROUND_Y - 330 - rng() * 40;
            platforms.push({
              x: towerX,
              y: towerY,
              w: towerW,
              h: 26,
              type: 'ledge',
              highTower: true,
            });
            for (let i = 0; i < 3; i += 1) {
              coins.push(makeCoin(towerX + 16 + i * 26, towerY - 36));
            }
            if (rng() > 0.5) {
              enemies.push(
                makeEnemy(
                  level >= 2 && rng() > 0.5 ? 'archer' : 'skeleton',
                  towerX + 16,
                  towerY,
                  towerX,
                  towerX + towerW,
                  rng,
                  level
                )
              );
            }
          }
        }
      }

      if (rng() > 0.65 && width > 400) {
        const spikeX = x + 90 + rng() * Math.max(20, width - 200);
        hazards.push({
          type: 'spikes',
          x: spikeX,
          y: GROUND_Y - 16,
          w: 52,
          h: 16,
        });
      }

      if (level >= 2 && rng() > 0.72 && width > 360) {
        const fireX = x + 120 + rng() * Math.max(20, width - 240);
        hazards.push({
          type: 'fire',
          x: fireX,
          y: GROUND_Y - 50,
          w: 32,
          h: 50,
          timer: rng() * 2.5,
          interval: 2.8,
          activeTime: 1.1,
          active: false,
        });
      }

      if (rng() > 0.35) {
        const coinCount = 4 + Math.floor(rng() * 4);
        const startCoin = x + 70 + rng() * Math.max(10, width - 190);
        for (let i = 0; i < coinCount; i += 1) {
          coins.push(makeCoin(startCoin + i * 34, GROUND_Y - 58));
        }
      }

      if (rng() > 0.5) {
        for (let i = 0; i < 5; i += 1) {
          const t = i / 4;
          coins.push(
            makeCoin(
              x - gap + t * gap,
              GROUND_Y - 130 - Math.sin(t * Math.PI) * 70
            )
          );
        }
      }

      const enemyCount = rng() > 0.6 ? 2 : 1;
      for (let e = 0; e < enemyCount; e += 1) {
        if (rng() > 0.2) {
          const enemyX = x + 80 + rng() * Math.max(10, width - 200);
          enemies.push(
            makeEnemy('goblin', enemyX, GROUND_Y, x + 24, x + width - 24, rng, level)
          );
        }
      }

      if (rng() > 0.48) {
        const skelX = x + 70 + rng() * Math.max(10, width - 180);
        enemies.push(
          makeEnemy('skeleton', skelX, GROUND_Y, x + 24, x + width - 24, rng, level)
        );
      }

      if (level >= 2 && rng() > 0.55) {
        const archerX = x + 70 + rng() * Math.max(10, width - 180);
        enemies.push(
          makeEnemy(
            'archer',
            archerX,
            GROUND_Y,
            x + 24,
            x + width - 24,
            rng,
            level
          )
        );
      }

      if (level >= 2 && rng() > 0.6) {
        const snakeX = x + 100 + rng() * Math.max(10, width - 200);
        enemies.push(
          makeEnemy('fire_snake', snakeX, GROUND_Y, x + 30, x + width - 30, rng, level)
        );
      }

      if (level >= 3 && rng() > 0.7) {
        const golemX = x + 120 + rng() * Math.max(10, width - 240);
        enemies.push(
          makeEnemy('golem', golemX, GROUND_Y, x + 40, x + width - 40, rng, level)
        );
      }

      if (level >= 4 && rng() > 0.65) {
        const basaX = x + 110 + rng() * Math.max(10, width - 220);
        enemies.push(
          makeEnemy('basajaun', basaX, GROUND_Y, x + 35, x + width - 35, rng, level)
        );
      }

      if (level >= 5 && rng() > 0.72) {
        const tartaloX = x + 120 + rng() * Math.max(10, width - 240);
        enemies.push(
          makeEnemy('tartalo', tartaloX, GROUND_Y, x + 40, x + width - 40, rng, level)
        );
      }

      if (level >= 6 && rng() > 0.78 && width > 420) {
        const gargX = x + 130 + rng() * Math.max(10, width - 260);
        enemies.push(
          makeEnemy('gargantua', gargX, GROUND_Y, x + 40, x + width - 40, rng, level)
        );
      }

      if (level >= 2 && rng() > 0.52) {
        const iratxoX = x + 60 + rng() * Math.max(10, width - 160);
        enemies.push(
          makeEnemy('iratxo', iratxoX, GROUND_Y, x + 20, x + width - 20, rng, level)
        );
      }

      if (level >= 2 && rng() > 0.62) {
        const batX = x + 40 + rng() * Math.max(10, width - 80);
        const batY = GROUND_Y - 135 - rng() * 45;
        enemies.push(
          makeEnemy('bat', batX, batY, x + 30, x + width - 30, rng, level)
        );
      }
    }

    x += width;
  }

  x += 110 + rng() * 40;
  const finalWidth = 980;
  const finalPlatform = groundPlatform(x, finalWidth);
  platforms.push(finalPlatform);

  if (!denda) {
    const candidates = platforms
      .filter((p) => p.type === 'ground' && p.w >= 480 && p.x < x)
      .sort(
        (a, b) =>
          Math.abs(a.x + a.w / 2 - dendaTarget) -
          Math.abs(b.x + b.w / 2 - dendaTarget)
      );
    const host = candidates[0] || finalPlatform;
    denda = addDenda(host, rng);
  }

  const goalX = x + finalWidth - 420;
  const goal = { x: goalX, y: GROUND_Y - 200, w: 130, h: 200 };

  for (let i = 0; i < 5; i += 1) {
    coins.push(makeCoin(goalX - 250 + i * 42, GROUND_Y - 72));
  }

  return {
    level,
    themeIndex,
    width: x + finalWidth + 200,
    platforms,
    coins,
    enemies,
    hazards,
    goal,
    denda,
    spawn: { x: 140, y: GROUND_Y - PLAYER.h },
  };
}

export function createPlayer(spawn) {
  return {
    x: spawn.x,
    y: spawn.y,
    w: PLAYER.w,
    h: PLAYER.h,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    hearts: PLAYER.maxHearts,
    maxHearts: PLAYER.maxHearts,
    invulnerable: 0,
    runPhase: 0,
    coyote: 0,
    jumpBuffer: 0,
    prevBottom: spawn.y + PLAYER.h,
    airJumps: 0,
    attackCooldown: 0,
    attackTimer: 0,
    attackId: 0,
    shootCooldown: 0,
    shootTimer: 0,
    dashCooldown: 0,
    dashTimer: 0,
    shieldCooldown: 0,
    crouching: false,
  };
}

function defaultUpgrades() {
  return {
    speed: 0,
    jump: 0,
    swordDamage: 0,
    rangedDamage: 0,
    pierce: 0,
    // Sistema de ropa por capas:
    clothing: 'guerrero', // 'guerrero' | 'paños'
    cape: false,          // +10% salto
    shieldHits: 0,        // cargas de escudo restantes (máx 3)
    shieldOwned: false,   // prerrequisito para armadura
    armorHits: 0,         // cargas de armadura (máx 5)
    // Resto de mejoras:
    longSword: false,
    doubleJump: false,
    magnet: false,
    daggerFan: false,
    dash: false,
    revive: false,
    reviveUsed: false,
    coinBonus: 0,
    ice: false,
  };
}

export function createGameState({
  worldWidth = 480,
  level = 1,
  rng = Math.random,
  heroId = 'aritza',
} = {}) {
  const world = createLevel(level, rng);
  const player = createPlayer(world.spawn);
  return {
    status: 'playing',
    worldWidth,
    level: world.level,
    themeIndex: world.themeIndex,
    world,
    player,
    heroId,
    cameraX: 0,
    coins: 0,
    coinsCollected: 0,
    coinsSpent: 0,
    defeated: 0,
    bonus: 0,
    score: 0,
    elapsed: 0,
    particles: [],
    projectiles: [],
    upgrades: { ...defaultUpgrades() },
    weapons: { sword: true, bow: false, daggers: false, equipped: null },
    checkpoint: { x: world.spawn.x, y: world.spawn.y },
  };
}

export function setWorldWidth(state, worldWidth) {
  state.worldWidth = worldWidth;
  updateCamera(state);
}

export function updateCamera(state) {
  const maxX = Math.max(0, state.world.width - state.worldWidth);
  const target = state.player.x + state.player.w / 2 - state.worldWidth * 0.4;
  state.cameraX = clamp(target, 0, maxX);
}

export function playerHitbox(player) {
  if (player.crouching) {
    return {
      x: player.x + 7,
      y: player.y + player.h * 0.45,
      w: player.w - 14,
      h: player.h * 0.55 - 4,
    };
  }
  return {
    x: player.x + 7,
    y: player.y + 6,
    w: player.w - 14,
    h: player.h - 10,
  };
}

export function enemyHitbox(enemy) {
  return {
    x: enemy.x + 5,
    y: enemy.y + 5,
    w: enemy.w - 10,
    h: enemy.h - 10,
  };
}

export function coinRect(coin) {
  return { x: coin.x, y: coin.y, w: coin.w, h: coin.h };
}

function projectileRect(projectile) {
  return {
    x: projectile.x,
    y: projectile.y,
    w: projectile.w,
    h: projectile.h,
  };
}

// ---------------------------------------------------------------- Tienda ---

export function itemAvailable(state, item) {
  const { upgrades, weapons, player } = state;
  switch (item.effect) {
    case 'heal':
      return player.hearts < player.maxHearts;
    case 'fullHeal':
      return player.hearts < player.maxHearts;
    case 'maxHeart':
    case 'maxHeartFull':
      return player.maxHearts < MAX_HEARTS;
    case 'speed':
      return upgrades.speed < 0.3;
    case 'jump':
      return upgrades.jump < 0.36;
    case 'magnet':
      return !upgrades.magnet;
    case 'shieldCharge':
      return false; // obsoleto
    case 'swordDamage':
      return upgrades.swordDamage < 3;
    case 'rangedDamage':
      return upgrades.rangedDamage < 3;
    case 'pierce':
      return upgrades.pierce < 2;
    case 'daggerFan':
      return !upgrades.daggerFan;
    case 'doubleJump':
      return !upgrades.doubleJump;
    case 'shield':
      return upgrades.shieldHits < 3;
    case 'armor':
      return upgrades.cape && upgrades.shieldOwned && upgrades.armorHits === 0;
    case 'cape':
      return !upgrades.cape;
    case 'longSword':
      return !upgrades.longSword;
    case 'sword':
      return !weapons.sword;
    case 'bow':
      return !weapons.bow;
    case 'daggers':
      return !weapons.daggers;
    case 'revive':
      return !upgrades.revive;
    case 'dash':
      return !upgrades.dash;
    case 'coinBonus':
      return upgrades.coinBonus < 3;
    case 'ice':
      return !upgrades.ice;
    default:
      return false;
  }
}

function pickRandom(list, rng) {
  if (!list.length) return null;
  return list[Math.floor(rng() * list.length) % list.length];
}

function rolledOffer(item) {
  return { ...item, sold: false };
}

export function rollDendaOffers(state, rng = Math.random) {
  const offers = [];
  const used = new Set();

  const addFromCategory = (category) => {
    const pool = SHOP_BY_CATEGORY[category].filter(
      (item) => itemAvailable(state, item) && !used.has(item.id)
    );
    if (!pool.length) return false;
    const item = pickRandom(pool, rng);
    used.add(item.id);
    offers.push(rolledOffer(item));
    return true;
  };

  // El equipo intenta garantizar un arma si aún no hay ninguna.
  const weaponPool = SHOP_BY_CATEGORY.equipo.filter(
    (item) =>
      itemAvailable(state, item) &&
      !used.has(item.id) &&
      ['sword', 'bow', 'daggers'].includes(item.effect)
  );
  const anyWeapon = state.weapons.sword || state.weapons.bow || state.weapons.daggers;
  let equipoItem = null;
  if (!anyWeapon && weaponPool.length) {
    equipoItem = pickRandom(weaponPool, rng);
  } else {
    const equipPool = SHOP_BY_CATEGORY.equipo.filter(
      (item) => itemAvailable(state, item) && !used.has(item.id)
    );
    equipoItem = pickRandom(equipPool, rng);
  }
  if (equipoItem) {
    used.add(equipoItem.id);
    offers.push(rolledOffer(equipoItem));
  }

  addFromCategory('pintxo');
  addFromCategory('pocima');

  // Relleno por si alguna categoría se ha quedado sin opciones válidas.
  const allPool = Object.values(SHOP_ITEMS).filter(
    (item) => itemAvailable(state, item) && !used.has(item.id)
  );
  while (offers.length < 3 && allPool.length) {
    const index = Math.floor(rng() * allPool.length) % allPool.length;
    const [item] = allPool.splice(index, 1);
    used.add(item.id);
    offers.push(rolledOffer(item));
  }

  // Garantiza al menos una opción barata para que la DENDA nunca sea inútil.
  if (offers.length && offers.every((offer) => offer.price > 8)) {
    const cheap = SHOP_BY_CATEGORY.pintxo.find(
      (item) =>
        itemAvailable(state, item) &&
        item.price <= 8 &&
        !offers.some((offer) => offer.id === item.id)
    );
    if (cheap) offers[offers.length - 1] = rolledOffer(cheap);
  }

  return offers.slice(0, 3);
}

export function applyDendaEffect(state, item) {
  const { upgrades, weapons, player } = state;
  switch (item.effect) {
    case 'heal':
      player.hearts = Math.min(player.maxHearts, player.hearts + item.value);
      break;
    case 'fullHeal':
      player.hearts = player.maxHearts;
      break;
    case 'maxHeart':
      player.maxHearts = Math.min(MAX_HEARTS, player.maxHearts + item.value);
      player.hearts = Math.min(
        player.maxHearts,
        player.hearts + Math.max(1, item.value)
      );
      break;
    case 'maxHeartFull':
      player.maxHearts = Math.min(MAX_HEARTS, player.maxHearts + item.value);
      player.hearts = player.maxHearts;
      break;
    case 'speed':
      upgrades.speed = Math.min(0.3, upgrades.speed + item.value);
      break;
    case 'jump':
      upgrades.jump = Math.min(0.36, upgrades.jump + item.value);
      break;
    case 'magnet':
      upgrades.magnet = true;
      break;
    case 'shieldCharge':
      upgrades.shieldCharges = Math.min(2, upgrades.shieldCharges + item.value);
      break;
    case 'swordDamage':
      upgrades.swordDamage += item.value;
      break;
    case 'rangedDamage':
      upgrades.rangedDamage += item.value;
      break;
    case 'pierce':
      upgrades.pierce += item.value;
      break;
    case 'daggerFan':
      upgrades.daggerFan = true;
      break;
    case 'doubleJump':
      upgrades.doubleJump = true;
      if (player.onGround) player.airJumps = 1;
      break;
    case 'shield':
      upgrades.shieldHits = Math.min(3, upgrades.shieldHits + item.value);
      upgrades.shieldOwned = true;
      break;
    case 'armor':
      upgrades.armorHits = item.value;
      break;
    case 'cape':
      upgrades.cape = true;
      break;
    case 'longSword':
      upgrades.longSword = true;
      weapons.sword = true;
      break;
    case 'sword':
      weapons.sword = true;
      break;
    case 'bow':
      weapons.bow = true;
      if (!weapons.equipped) weapons.equipped = 'bow';
      break;
    case 'daggers':
      weapons.daggers = true;
      if (!weapons.equipped) weapons.equipped = 'daggers';
      break;
    case 'revive':
      upgrades.revive = true;
      upgrades.reviveUsed = false;
      break;
    case 'dash':
      upgrades.dash = true;
      break;
    case 'coinBonus':
      upgrades.coinBonus = Math.min(3, upgrades.coinBonus + item.value);
      break;
    case 'ice':
      upgrades.ice = true;
      break;
    default:
      break;
  }
}

export function buyDendaOffer(state, offerId) {
  const denda = state.world.denda;
  if (!denda || !denda.offers) return { ok: false, reason: 'closed' };
  const offer = denda.offers.find((entry) => entry.id === offerId);
  if (!offer) return { ok: false, reason: 'missing' };
  if (offer.sold) return { ok: false, reason: 'sold' };
  if (state.coins < offer.price) return { ok: false, reason: 'coins' };
  if (!itemAvailable(state, offer)) return { ok: false, reason: 'max' };

  state.coins -= offer.price;
  state.coinsSpent += offer.price;
  applyDendaEffect(state, offer);
  offer.sold = true;
  return { ok: true, offer };
}

export function equipRanged(state, type) {
  if (type === 'bow' && !state.weapons.bow) return false;
  if (type === 'daggers' && !state.weapons.daggers) return false;
  if (type !== 'bow' && type !== 'daggers') return false;
  state.weapons.equipped = type;
  return true;
}

// --------------------------------------------------------------- Física ---

function resolveHorizontal(state, player) {
  for (const platform of state.world.platforms) {
    if (!rectsOverlap(player, platform)) continue;
    if (player.vx > 0) {
      player.x = platform.x - player.w;
    } else if (player.vx < 0) {
      player.x = platform.x + platform.w;
    }
    player.vx = 0;
  }
}

function resolveVertical(state, player) {
  for (const platform of state.world.platforms) {
    if (!rectsOverlap(player, platform)) continue;
    if (player.vy > 0) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.onGround = true;
    } else if (player.vy < 0) {
      player.y = platform.y + platform.h;
      player.vy = 0;
    }
  }
}

function supportingPlatform(state, player) {
  const feet = player.y + player.h;
  for (const platform of state.world.platforms) {
    if (Math.abs(feet - platform.y) > 3) continue;
    if (player.x + player.w > platform.x + 4 && player.x < platform.x + platform.w - 4) {
      return platform;
    }
  }
  return null;
}

function emitParticle(state, x, y, color, count, rng) {
  for (let i = 0; i < count; i += 1) {
    const angle = rng() * Math.PI * 2;
    const speed = 60 + rng() * 220;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 120,
      life: 0.35 + rng() * 0.35,
      maxLife: 0.7,
      size: 2 + rng() * 4,
      color,
    });
  }
}

function updateParticles(state, dt) {
  for (const particle of state.particles) {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 900 * dt;
  }
  state.particles = state.particles.filter((p) => p.life > 0);
}

function respawnPlayer(state, events) {
  const player = state.player;
  player.x = state.checkpoint.x;
  player.y = state.checkpoint.y;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.invulnerable = PLAYER.invulnerableTime;
  events.push({ type: 'respawn' });
}

function loseHeart(state, events, reason, sourceX = null) {
  const player = state.player;
  const upgrades = state.upgrades;

  if (player.invulnerable > 0 && reason !== 'fall') return false;

  // 1. Escudo físico (shieldHits) — solo absorbe golpes de enemigo/proyectil
  if (
    (reason === 'enemy' || reason === 'projectile') &&
    upgrades.shieldHits > 0
  ) {
    upgrades.shieldHits -= 1;
    player.invulnerable = Math.max(player.invulnerable, 0.8);
    events.push({ type: 'shieldblock', source: 'shield' });
    return false;
  }

  // 2. Armadura — absorbe cualquier golpe excepto caídas
  if (reason !== 'fall' && upgrades.armorHits > 0) {
    upgrades.armorHits -= 1;
    player.invulnerable = Math.max(player.invulnerable, 0.6);
    events.push({ type: 'shieldblock', source: 'armor' });
    return false;
  }

  // 3. Ropa de guerrero — absorbe 1 golpe y pasa a paños menores
  if (reason !== 'fall' && upgrades.clothing === 'guerrero') {
    upgrades.clothing = 'paños';
    player.invulnerable = Math.max(player.invulnerable, 0.6);
    events.push({ type: 'clothinglost' });
    return false;
  }

  // 4. Sin protección — pierde corazón
  player.hearts -= 1;
  events.push({ type: 'hurt', reason });

  if (player.hearts <= 0) {
    if (state.upgrades.revive && !state.upgrades.reviveUsed) {
      state.upgrades.reviveUsed = true;
      player.hearts = Math.min(2, player.maxHearts);
      player.invulnerable = 2;
      events.push({ type: 'revive' });
      if (reason === 'fall') respawnPlayer(state, events);
      return false;
    }
    player.hearts = 0;
    state.status = 'dead';
    events.push({ type: 'gameover' });
    return true;
  }

  if (reason === 'fall') {
    respawnPlayer(state, events);
  } else {
    player.invulnerable = PLAYER.invulnerableTime;
    player.vy = -540;
    player.onGround = false;
    if (sourceX !== null) {
      player.vx = player.x + player.w / 2 < sourceX ? -280 : 280;
    }
  }
  return false;
}

function performMelee(state, events, rng) {
  const player = state.player;
  const longSword = state.upgrades.longSword;
  const meleeReach = longSword ? 68 : 48;
  const hitbox = {
    x: player.facing > 0 ? player.x + player.w - 2 : player.x - meleeReach,
    y: player.y + 4,
    w: meleeReach,
    h: player.h - 8,
  };
  for (const enemy of state.world.enemies) {
    if (!enemy.alive) continue;
    if (!rectsOverlap(hitbox, enemyHitbox(enemy))) continue;
    damageEnemy(
      state,
      enemy,
      1 + state.upgrades.swordDamage,
      'sword',
      events,
      rng
    );
  }
}

function spawnPlayerProjectile(state, type, vy, rng) {
  const player = state.player;
  const bow = type === 'bow';
  const fan = state.upgrades.daggerFan && !bow;
  const speed = bow ? 560 : 640;
  const shootY = player.crouching
    ? player.y + player.h * 0.72
    : player.y + player.h * 0.42;
  state.projectiles.push({
    owner: 'player',
    type,
    x: player.x + (player.facing > 0 ? player.w : -10),
    y: shootY,
    w: bow ? 22 : 16,
    h: 6,
    vx: player.facing * speed,
    vy: fan ? vy : 0,
    damage: 1 + state.upgrades.rangedDamage,
    life: bow ? 1.15 : 0.5,
    pierce: state.upgrades.pierce,
    hit: [],
  });
  emitParticle(
    state,
    player.x + player.w / 2 + player.facing * 20,
    shootY,
    bow ? '#f7e3ad' : '#d7d2c0',
    3,
    rng
  );
}

function attractCoins(state, dt) {
  if (!state.upgrades.magnet) return;
  const player = state.player;
  const px = player.x + player.w / 2;
  const py = player.y + player.h / 2;
  for (const coin of state.world.coins) {
    if (coin.collected) continue;
    const cx = coin.x + coin.w / 2;
    const cy = coin.y + coin.h / 2;
    const dx = px - cx;
    const dy = py - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 150 && dist > 1) {
      const speed = 300;
      coin.x += (dx / dist) * speed * dt;
      coin.y += (dy / dist) * speed * dt;
    }
  }
}

function updatePlayer(state, dt, input, events, rng) {
  const player = state.player;
  const theme = THEMES[state.themeIndex];
  const upgrades = state.upgrades;

  if (player.invulnerable > 0) {
    player.invulnerable = Math.max(0, player.invulnerable - dt);
  }
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.attackTimer = Math.max(0, player.attackTimer - dt);
  player.shootCooldown = Math.max(0, player.shootCooldown - dt);
  player.shootTimer = Math.max(0, player.shootTimer - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.shieldCooldown = Math.max(0, player.shieldCooldown - dt);

  const wantsCrouch = Boolean(input.crouchHeld || input.crouchQueued);
  player.crouching = wantsCrouch;

  const left = Boolean(input.left);
  const right = Boolean(input.right);
  const move = (right ? 1 : 0) - (left ? 1 : 0);
  const speedScale = 1 + upgrades.speed;
  const maxSpeed = (player.crouching ? PLAYER.maxSpeed * 0.45 : PLAYER.maxSpeed) * speedScale;
  const accel = (player.onGround ? PLAYER.accel : PLAYER.airAccel) * speedScale;

  if (input.dash && upgrades.dash && player.dashCooldown <= 0) {
    player.dashTimer = 0.16;
    player.dashCooldown = 1.2;
    player.vx = player.facing * 640;
    events.push({ type: 'dash' });
    emitParticle(
      state,
      player.x + player.w / 2,
      player.y + player.h - 10,
      '#f7e3ad',
      10,
      rng
    );
  }

  if (player.dashTimer > 0) {
    player.dashTimer = Math.max(0, player.dashTimer - dt);
    player.vx = player.facing * 640;
  } else if (move !== 0) {
    player.vx += move * accel * dt;
    player.facing = move;
    player.vx = clamp(player.vx, -maxSpeed, maxSpeed);
  } else {
    const friction = player.onGround ? PLAYER.friction : PLAYER.airFriction;
    if (player.vx > 0) player.vx = Math.max(0, player.vx - friction * dt);
    else if (player.vx < 0) player.vx = Math.min(0, player.vx + friction * dt);
  }

  if (player.onGround) {
    player.coyote = PLAYER.coyoteTime;
    player.airJumps = upgrades.doubleJump ? 1 : 0;
  } else {
    player.coyote = Math.max(0, player.coyote - dt);
  }

  if (input.jump) player.jumpBuffer = PLAYER.jumpBufferTime;
  else player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);

  const capeBonus = upgrades.cape ? 0.10 : 0;
  const jumpVelocity = PLAYER.jumpVelocity * (1 + upgrades.jump + capeBonus);
  let jumped = false;
  if (player.jumpBuffer > 0 && player.coyote > 0) {
    player.vy = jumpVelocity;
    player.onGround = false;
    player.coyote = 0;
    player.jumpBuffer = 0;
    jumped = true;
    events.push({ type: 'jump' });
  } else if (
    !jumped &&
    input.jump &&
    player.jumpBuffer > 0 &&
    !player.onGround &&
    player.airJumps > 0
  ) {
    player.vy = jumpVelocity * 0.92;
    player.airJumps -= 1;
    player.jumpBuffer = 0;
    events.push({ type: 'airjump' });
    emitParticle(
      state,
      player.x + player.w / 2,
      player.y + player.h,
      '#f7e3ad',
      9,
      rng
    );
  }

  const releasingJump = player.vy < 0 && !input.jumpHeld;
  const gravity = releasingJump ? PLAYER.gravityRelease : PLAYER.gravity;
  player.vy = Math.min(PLAYER.maxFall, player.vy + gravity * dt);

  player.x += player.vx * dt;
  resolveHorizontal(state, player);

  player.prevBottom = player.y + player.h;
  const wasOnGround = player.onGround;
  const fallSpeed = player.vy;
  player.onGround = false;
  player.y += player.vy * dt;
  resolveVertical(state, player);

  if (player.onGround) {
    player.airJumps = upgrades.doubleJump ? 1 : 0;
  }

  if (player.onGround && !wasOnGround) {
    events.push({ type: 'land' });
    if (fallSpeed > 260) {
      emitParticle(
        state,
        player.x + player.w / 2,
        player.y + player.h,
        theme.accent,
        3,
        rng
      );
    }
  }

  player.x = clamp(player.x, 0, state.world.width - player.w);

  if (player.onGround) {
    const platform = supportingPlatform(state, player);
    if (platform) {
      state.checkpoint.x = clamp(
        player.x,
        platform.x + 30,
        platform.x + platform.w - player.w - 30
      );
      state.checkpoint.y = player.y;
    }
  }

  if (input.attack && state.weapons.sword && player.attackCooldown <= 0) {
    player.attackCooldown = 0.38;
    player.attackTimer = 0.18;
    player.attackId += 1;
    events.push({ type: 'slash' });
    performMelee(state, events, rng);
  }

  if (input.shoot && state.weapons.equipped && player.shootCooldown <= 0) {
    const type = state.weapons.equipped;
    const bow = type === 'bow';
    player.shootCooldown = bow ? 0.65 : 0.28;
    player.shootTimer = 0.16;
    if (type === 'daggers' && upgrades.daggerFan) {
      spawnPlayerProjectile(state, type, -80, rng);
      spawnPlayerProjectile(state, type, 0, rng);
      spawnPlayerProjectile(state, type, 80, rng);
    } else {
      spawnPlayerProjectile(state, type, 0, rng);
    }
    events.push({ type: 'shoot', weapon: type });
  }

  player.runPhase += dt * (player.onGround ? 6 + Math.abs(player.vx) / 24 : 2.5);

  if (player.y > LOGICAL_HEIGHT + 80) {
    loseHeart(state, events, 'fall');
  }
}

function updateEnemies(state, dt, events = [], rng = Math.random, canShoot = true) {
  const player = state.player;
  const playerCx = player.x + player.w / 2;
  const playerCy = player.y + player.h / 2;

  for (const enemy of state.world.enemies) {
    if (!enemy.alive) continue;
    if (enemy.hitFlash > 0) enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    if (enemy.slowTimer > 0) enemy.slowTimer = Math.max(0, enemy.slowTimer - dt);
    const slow = enemy.slowTimer > 0 ? 0.5 : 1;

    if (enemy.type === 'bat') {
      enemy.phase += dt * 6;
      enemy.x += enemy.vx * slow * dt;
      if (enemy.x < enemy.minX) {
        enemy.x = enemy.minX;
        enemy.vx = Math.abs(enemy.vx);
      } else if (enemy.x + enemy.w > enemy.maxX) {
        enemy.x = enemy.maxX - enemy.w;
        enemy.vx = -Math.abs(enemy.vx);
      }
      enemy.y = enemy.baseY + Math.sin(enemy.phase) * 26;
      continue;
    }

    if (enemy.type === 'archer') {
      enemy.shootCooldown = Math.max(0, enemy.shootCooldown - dt);
      const cx = enemy.x + enemy.w / 2;
      const cy = enemy.y + enemy.h / 2;
      const inRange =
        canShoot &&
        Math.abs(playerCx - cx) < 520 &&
        Math.abs(playerCy - cy) < 190;

      if (enemy.windup > 0) {
        enemy.windup = Math.max(0, enemy.windup - dt);
        enemy.aiming = true;
        enemy.facing = playerCx >= cx ? 1 : -1;
        enemy.vx = 0;
        if (enemy.windup <= 0 && inRange) {
          const dx = playerCx - cx;
          const dy = playerCy - cy;
          const len = Math.hypot(dx, dy) || 1;
          state.projectiles.push({
            owner: 'enemy',
            type: 'arrow',
            x: cx + (dx >= 0 ? 14 : -18),
            y: cy - 4,
            w: 20,
            h: 6,
            vx: (dx / len) * 300,
            vy: (dy / len) * 300,
            damage: 1,
            life: 2.2,
            pierce: 0,
            hit: [],
          });
          events.push({ type: 'enemyshoot', enemy: 'archer' });
          enemy.aiming = false;
        }
      } else if (inRange && enemy.shootCooldown <= 0) {
        enemy.windup = 0.55;
        enemy.shootCooldown = 1.8;
        enemy.aiming = true;
        enemy.facing = playerCx >= cx ? 1 : -1;
        enemy.vx = 0;
      } else {
        enemy.aiming = false;
        enemy.vx = enemy.patrolDir * ENEMY_DEFS.archer.speed;
        enemy.x += enemy.vx * slow * dt;
        if (enemy.x < enemy.minX) {
          enemy.x = enemy.minX;
          enemy.patrolDir = 1;
        } else if (enemy.x + enemy.w > enemy.maxX) {
          enemy.x = enemy.maxX - enemy.w;
          enemy.patrolDir = -1;
        }
      }
      enemy.facing = enemy.aiming
        ? playerCx >= enemy.x + enemy.w / 2
          ? 1
          : -1
        : enemy.patrolDir;
      continue;
    }

    if (enemy.type === 'skeleton') {
      enemy.hopTimer = Math.max(0, enemy.hopTimer - dt);
      if (enemy.hopTimer <= 0 && enemy.y >= enemy.baseY - enemy.h - 1) {
        enemy.vy = -420;
        enemy.hopTimer = 1.3 + rng() * 1.1;
      }
      if (enemy.vy !== 0 || enemy.y < enemy.baseY - enemy.h) {
        enemy.vy += 1400 * dt;
        enemy.y += enemy.vy * dt;
        if (enemy.y >= enemy.baseY - enemy.h) {
          enemy.y = enemy.baseY - enemy.h;
          enemy.vy = 0;
        }
      }
      enemy.x += enemy.vx * slow * dt;
      if (enemy.x < enemy.minX) {
        enemy.x = enemy.minX;
        enemy.vx = Math.abs(enemy.vx);
      } else if (enemy.x + enemy.w > enemy.maxX) {
        enemy.x = enemy.maxX - enemy.w;
        enemy.vx = -Math.abs(enemy.vx);
      }
      enemy.facing = enemy.vx >= 0 ? 1 : -1;
      continue;
    }

    if (enemy.type === 'fire_snake') {
      enemy.shootCooldown = Math.max(0, enemy.shootCooldown - dt);
      const cx = enemy.x + enemy.w / 2;
      const inRange = canShoot && Math.abs(playerCx - cx) < 460;
      if (inRange && enemy.shootCooldown <= 0) {
        enemy.shootCooldown = 2.4 + rng() * 0.8;
        const dir = playerCx >= cx ? 1 : -1;
        enemy.facing = dir;
        state.projectiles.push({
          owner: 'enemy',
          type: 'fireball',
          x: cx + dir * 18,
          y: enemy.y + 8,
          w: 16,
          h: 16,
          vx: dir * 260,
          vy: -110,
          damage: 1,
          life: 2.4,
          pierce: 0,
          hit: [],
        });
        events.push({ type: 'enemyshoot', enemy: 'fire_snake' });
      }
      enemy.phase += dt * 6;
      enemy.x += enemy.vx * slow * dt;
      if (enemy.x < enemy.minX) {
        enemy.x = enemy.minX;
        enemy.vx = Math.abs(enemy.vx);
      } else if (enemy.x + enemy.w > enemy.maxX) {
        enemy.x = enemy.maxX - enemy.w;
        enemy.vx = -Math.abs(enemy.vx);
      }
      enemy.facing = enemy.vx >= 0 ? 1 : -1;
      continue;
    }

    enemy.phase += dt * (enemy.type === 'golem' ? 4 : 8);
    enemy.x += enemy.vx * slow * dt;
    if (enemy.x < enemy.minX) {
      enemy.x = enemy.minX;
      enemy.vx = Math.abs(enemy.vx);
    } else if (enemy.x + enemy.w > enemy.maxX) {
      enemy.x = enemy.maxX - enemy.w;
      enemy.vx = -Math.abs(enemy.vx);
    }
    enemy.facing = enemy.vx >= 0 ? 1 : -1;
  }
}

function collectCoins(state, events, rng) {
  const box = playerHitbox(state.player);
  const theme = THEMES[state.themeIndex];

  for (const coin of state.world.coins) {
    if (coin.collected) continue;
    if (!rectsOverlap(box, coinRect(coin))) continue;

    coin.collected = true;
    const amount = 1 + state.upgrades.coinBonus;
    state.coins += amount;
    state.coinsCollected += amount;
    state.score += 10 * amount;
    events.push({ type: 'coin', amount });
    emitParticle(
      state,
      coin.x + coin.w / 2,
      coin.y + coin.h / 2,
      theme.accent,
      7,
      rng
    );
  }
}

export function damageEnemy(state, enemy, amount, source, events, rng) {
  if (!enemy.alive) return false;
  const hp = enemy.hp ?? ENEMY_DEFS[enemy.type]?.hp ?? 1;
  enemy.hp = hp - amount;
  enemy.hitFlash = 0.14;
  events.push({ type: 'enemyhit', enemy: enemy.type, source });

  if ((source === 'arrow' || source === 'dagger') && state.upgrades.ice) {
    enemy.slowTimer = 2;
  }

  if (enemy.hp > 0) {
    emitParticle(
      state,
      enemy.x + enemy.w / 2,
      enemy.y + enemy.h / 2,
      '#f0c060',
      6,
      rng
    );
    return false;
  }

  enemy.alive = false;
  state.defeated += 1;
  state.score += enemy.score;
  events.push({ type: 'enemydeath', enemy: enemy.type });

  if (enemy.coinDrop) {
    for (let i = 0; i < enemy.coinDrop; i += 1) {
      state.world.coins.push(
        makeCoin(enemy.x + enemy.w / 2 - 40 + i * 32, GROUND_Y - 58)
      );
    }
  }

  emitParticle(
    state,
    enemy.x + enemy.w / 2,
    enemy.y + enemy.h / 2,
    enemy.type === 'golem' ? '#b9b3a0' : '#7ec850',
    14,
    rng
  );
  return true;
}

function collideEnemies(state, events, rng) {
  const player = state.player;
  const box = playerHitbox(player);

  for (const enemy of state.world.enemies) {
    if (!enemy.alive) continue;
    if (!rectsOverlap(box, enemyHitbox(enemy))) continue;

    const def = ENEMY_DEFS[enemy.type] || {};
    const stomping = player.vy > 0 && player.prevBottom <= enemy.y + 14 && !def.spikeTop;
    if (stomping) {
      damageEnemy(state, enemy, 1, 'stomp', events, rng);
      player.vy = PLAYER.stompBounce;
      player.onGround = false;
      player.coyote = 0;
      if (state.upgrades.doubleJump) player.airJumps = 1;
      events.push({ type: 'stomp', enemy: enemy.type });
      emitParticle(
        state,
        enemy.x + enemy.w / 2,
        enemy.y + enemy.h / 2,
        '#7ec850',
        14,
        rng
      );
    } else {
      if (player.invulnerable > 0) continue;
      const dead = loseHeart(
        state,
        events,
        'enemy',
        enemy.x + enemy.w / 2
      );
      emitParticle(
        state,
        box.x + box.w / 2,
        box.y + box.h / 2,
        '#e05a5a',
        16,
        rng
      );
      if (dead) return;
    }
  }
}

function frontalProjectile(player, projectile) {
  return (
    (projectile.vx > 0 && player.facing < 0) ||
    (projectile.vx < 0 && player.facing > 0)
  );
}

function updateProjectiles(state, dt, events, rng) {
  const player = state.player;
  const box = playerHitbox(player);
  const remaining = [];

  for (const projectile of state.projectiles) {
    projectile.life -= dt;
    if (projectile.type === 'fireball') {
      projectile.vy += 220 * dt;
    }
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;

    let remove = projectile.life <= 0;
    if (!remove && (projectile.x + projectile.w < -120 || projectile.x > state.world.width + 120)) {
      remove = true;
    }

    if (!remove) {
      for (const platform of state.world.platforms) {
        if (rectsOverlap(projectileRect(projectile), platform)) {
          remove = true;
          emitParticle(
            state,
            projectile.x,
            projectile.y,
            projectile.type === 'fireball' ? '#ff6600' : '#d8c49a',
            projectile.type === 'fireball' ? 6 : 3,
            rng
          );
          break;
        }
      }
    }

    if (!remove && projectile.owner === 'player') {
      for (const enemy of state.world.enemies) {
        if (!enemy.alive) continue;
        if (projectile.hit.includes(enemy)) continue;
        if (!rectsOverlap(projectileRect(projectile), enemyHitbox(enemy))) {
          continue;
        }
        projectile.hit.push(enemy);
        damageEnemy(
          state,
          enemy,
          projectile.damage,
          projectile.type,
          events,
          rng
        );
        if (projectile.pierce > 0) {
          projectile.pierce -= 1;
        } else {
          remove = true;
        }
        break;
      }
    }

    if (!remove && projectile.owner === 'enemy') {
      if (rectsOverlap(projectileRect(projectile), box)) {
        if (
          state.upgrades.shieldHits > 0 &&
          player.shieldCooldown <= 0 &&
          frontalProjectile(player, projectile)
        ) {
          player.shieldCooldown = 0.8;
          state.upgrades.shieldHits -= 1;
          events.push({ type: 'shieldblock', source: 'shield' });
          emitParticle(
            state,
            projectile.x,
            projectile.y,
            '#f7e3ad',
            8,
            rng
          );
        } else {
          loseHeart(state, events, 'projectile', projectile.x);
        }
        remove = true;
      }
    }

    if (!remove) remaining.push(projectile);
  }

  state.projectiles = remaining;
}

function checkGoal(state, events) {
  if (!rectsOverlap(playerHitbox(state.player), state.world.goal)) return false;
  state.status = 'won';
  const reward = 50 + state.level * 25;
  state.bonus += reward;
  state.score += reward;
  events.push({ type: 'goal', level: state.level, reward });
  return true;
}

function handleDendaTrigger(state, events, rng) {
  const denda = state.world.denda;
  if (!denda) return;
  const inside = rectsOverlap(playerHitbox(state.player), denda.trigger);

  if (inside && !denda.inside) {
    denda.inside = true;
    if (!denda.healed) {
      state.player.hearts = state.player.maxHearts;
      denda.healed = true;
      events.push({ type: 'denda-heal' });
    }
    if (!denda.offers) {
      denda.offers = rollDendaOffers(state, rng);
    }
    denda.visited = true;
    state.checkpoint.x = denda.x + denda.w / 2 - state.player.w / 2;
    state.checkpoint.y = GROUND_Y - state.player.h;
    if (denda.offers.some((offer) => !offer.sold)) {
      events.push({ type: 'denda' });
    }
  } else if (!inside && denda.inside) {
    denda.inside = false;
  }
}

function updateHazards(state, dt, events, rng) {
  if (!state.world.hazards) return;
  const player = state.player;
  const box = playerHitbox(player);

  for (const hazard of state.world.hazards) {
    if (hazard.type === 'fire') {
      hazard.timer = (hazard.timer || 0) + dt;
      const cycle = hazard.timer % (hazard.interval || 2.8);
      hazard.active = cycle < (hazard.activeTime || 1.1);

      if (hazard.active && Math.abs(hazard.x - player.x) < 450 && rng() > 0.45) {
        emitParticle(
          state,
          hazard.x + hazard.w * 0.5 + (rng() - 0.5) * 12,
          hazard.y + hazard.h - rng() * 32,
          rng() > 0.5 ? '#ff4400' : '#ffaa00',
          1,
          rng
        );
      }
    }

    const hazardActive = hazard.type !== 'fire' || hazard.active;
    if (hazardActive && rectsOverlap(box, hazard)) {
      if (player.invulnerable <= 0) {
        loseHeart(state, events, 'hazard', hazard.x + hazard.w / 2);
        events.push({ type: 'hurt', reason: hazard.type });
        emitParticle(
          state,
          box.x + box.w / 2,
          box.y + box.h / 2,
          hazard.type === 'fire' ? '#ff6600' : '#e05a5a',
          14,
          rng
        );
      }
    }
  }
}

export function step(state, dt, input = {}, rng = Math.random) {
  const events = [];

  if (state.status !== 'playing') {
    updateParticles(state, dt);
    return events;
  }

  state.elapsed += dt;

  updatePlayer(state, dt, input, events, rng);
  if (state.status !== 'playing') {
    updateParticles(state, dt);
    updateCamera(state);
    return events;
  }

  handleDendaTrigger(state, events, rng);
  updateEnemies(state, dt, events, rng, true);
  attractCoins(state, dt);
  collectCoins(state, events, rng);
  collideEnemies(state, events, rng);
  updateHazards(state, dt, events, rng);
  updateProjectiles(state, dt, events, rng);

  if (state.status === 'playing') {
    checkGoal(state, events);
  }

  updateParticles(state, dt);
  updateCamera(state);

  return events;
}

export function finalScore(state) {
  return state.score;
}

export function nextLevel(state, rng = Math.random) {
  const world = createLevel(state.level + 1, rng);
  const player = state.player;

  state.level = world.level;
  state.themeIndex = world.themeIndex;
  state.world = world;
  state.status = 'playing';
  state.elapsed = 0;
  state.cameraX = 0;
  state.particles = [];
  state.projectiles = [];
  state.checkpoint = { x: world.spawn.x, y: world.spawn.y };

  player.x = world.spawn.x;
  player.y = world.spawn.y;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.facing = 1;
  player.invulnerable = 1;
  player.hearts = Math.min(player.maxHearts, player.hearts + 1);
  player.airJumps = state.upgrades.doubleJump ? 1 : 0;
  player.attackCooldown = 0;
  player.attackTimer = 0;
  player.shootCooldown = 0;
  player.shootTimer = 0;
  player.dashCooldown = 0;
  player.dashTimer = 0;
  player.shieldCooldown = 0;
  if (state.upgrades.clothing === 'paños') {
    state.upgrades.clothing = 'guerrero';
  }
  state.upgrades.shieldCharges = Math.min(2, state.upgrades.shieldCharges);
  state.upgrades.reviveUsed = false;

  updateCamera(state);
  return state;
}

export function getMilestoneLevel(level) {
  const lvl = Math.max(1, Math.floor(level || 1));
  return Math.floor((lvl - 1) / 5) * 5 + 1;
}

export function continueLevelWithHearts(state, heartsCount = 2) {
  state.status = 'playing';
  const player = state.player;
  player.hearts = Math.min(heartsCount, player.maxHearts);
  player.invulnerable = 2.0;
  player.x = state.checkpoint.x;
  player.y = state.checkpoint.y;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.airJumps = state.upgrades.doubleJump ? 1 : 0;
  player.attackCooldown = 0;
  player.attackTimer = 0;
  player.shootCooldown = 0;
  player.shootTimer = 0;
  player.dashCooldown = 0;
  player.dashTimer = 0;
  player.shieldCooldown = 0;
  if (state.upgrades.clothing === 'paños') {
    state.upgrades.clothing = 'guerrero';
  }
  state.projectiles = [];
  updateCamera(state);
  return state;
}

// Animación suave para el menú: enemigos y monedas cobran vida sin colisiones.
export function animateIdle(state, dt) {
  state.elapsed += dt;
  if (Math.abs(state.player.y + state.player.h - GROUND_Y) < 4) {
    state.player.onGround = true;
  }
  state.player.runPhase += dt * 2.5;
  updateEnemies(state, dt, [], Math.random, false);
  updateParticles(state, dt);
}
