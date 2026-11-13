// Generado automáticamente desde el dataset de barrios de Bilbao.
// 52 barrios x 20 preguntas = 1.040 preguntas. No editar a mano.
// Cada pregunta incluye fuente y fuenteTitulo; no hay preguntas de lemas, pintxos ni descripciones editoriales.
export const BARRIOS_TRIVIA = [
 {
  "nombre": "San Pedro de Deusto",
  "distrito": "Deustu",
  "lema": "La ribera de la sabiduría",
  "pintxo": {
   "nombre": "Pintxo de tomate de San Pedro de Deusto",
   "ingrediente": "tomate",
   "color": "#f2d27a",
   "forma": 0
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://es.wikipedia.org/wiki/Deusto",
   "https://es.wikipedia.org/wiki/San_Pedro_de_Deusto",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de San Pedro de Deusto?",
    "opts": [
     "Deustu",
     "Uribarri",
     "Begoña",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 0,
    "info": "San Pedro de Deusto forma parte del distrito Deustu.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía San Pedro de Deusto en el padrón de 2023?",
    "opts": [
     "7370",
     "171",
     "19.961",
     "2469"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 19.961 habitantes en San Pedro de Deusto.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué estación de metro da servicio a San Pedro de Deusto?",
    "opts": [
     "Txurdinaga (L3)",
     "Deustu (L1/L2)",
     "Basarrate (L1/L2)",
     "Uribarri (L3)"
    ],
    "ans": 1,
    "info": "La estación de metro más próxima es Deustu (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de San Pedro de Deusto?",
    "opts": [
     "Metro, tranvía, tren y autobús",
     "Metro · Uribarri (L3)",
     "Metro · Deustu (L1/L2)",
     "Tren · Renfe Cercanías Olabeaga"
    ],
    "ans": 2,
    "info": "San Pedro de Deusto: Metro · Deustu (L1/L2). Estación Deustu (salidas Iruña y Lehendakari Agirre)",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de San Pedro de Deusto?",
    "opts": [
     "Puente del Diablo, de un solo arco sobre el Cadagua",
     "Antiguos caseríos que dieron nombre a las calles, como el caserío Trauku",
     "Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia",
     "Monumento a Marx y Lenin en la plaza Kepa Enbeita, inaugurado en 1993 ('Lenin Eguna')"
    ],
    "ans": 2,
    "info": "«Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» es un hito de San Pedro de Deusto.",
    "tipo": "hitoId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia»?",
    "opts": [
     "San Pedro de Deusto",
     "Uribarri",
     "Iralabarri",
     "Campuzano"
    ],
    "ans": 0,
    "info": "«Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en San Pedro de Deusto.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a San Pedro de Deusto?",
    "opts": [
     "Plaza de San Pedro",
     "Entorno del Puente del Diablo",
     "Bilbao Intermodal",
     "Jardines de Solokoetxe"
    ],
    "ans": 0,
    "info": "«Plaza de San Pedro» está en San Pedro de Deusto.",
    "tipo": "espacioId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de San Pedro»?",
    "opts": [
     "Zurbaran",
     "San Pedro de Deusto",
     "Monte Caramelo",
     "Castaños"
    ],
    "ans": 1,
    "info": "«Plaza de San Pedro» pertenece a San Pedro de Deusto.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Universidad de Deusto»?",
    "opts": [
     "San Francisco",
     "San Mamés",
     "San Pedro de Deusto",
     "Santutxu"
    ],
    "ans": 2,
    "info": "«Universidad de Deusto» está en San Pedro de Deusto.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de San Felicísimo»?",
    "opts": [
     "Zorrotza",
     "Indautxu",
     "San Pedro de Deusto",
     "Ciudad Jardín"
    ],
    "ans": 2,
    "info": "«Plaza de San Felicísimo» pertenece a San Pedro de Deusto.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que San Pedro de Deusto?",
    "opts": [
     "Solokoetxe",
     "Betolaza",
     "Campuzano",
     "Arangoiti"
    ],
    "ans": 3,
    "info": "San Pedro de Deusto y Arangoiti están en el distrito Deustu.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Deustu?",
    "opts": [
     "Solokoetxe",
     "San Pedro de Deusto",
     "Masustegi",
     "Abando"
    ],
    "ans": 1,
    "info": "San Pedro de Deusto está en el distrito Deustu.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene San Pedro de Deusto estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: Deustu (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a San Pedro de Deusto?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Deustu (L1/L2) es la estación de metro de San Pedro de Deusto.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Sarriko (L1/L2) da servicio a San Pedro de Deusto?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, Sarriko (L1/L2) no es la estación de San Pedro de Deusto.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "San Pedro de Deusto",
     "Indautxu",
     "Abando"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Puente de Deusto (levadizo)»?",
    "opts": [
     "Bolueta",
     "San Pedro de Deusto",
     "Arabella",
     "Bilbao La Vieja"
    ],
    "ans": 1,
    "info": "«Puente de Deusto (levadizo)» está en San Pedro de Deusto.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Bidarte»?",
    "opts": [
     "Solokoetxe",
     "Ribera de Deusto",
     "San Pedro de Deusto",
     "Zorrotza"
    ],
    "ans": 2,
    "info": "«Parque de Bidarte» pertenece a San Pedro de Deusto.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia»?",
    "opts": [
     "Basurtu-Zorrotza",
     "Deustu",
     "Begoña",
     "Errekalde"
    ],
    "ans": 1,
    "info": "«Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en San Pedro de Deusto, distrito Deustu.",
    "tipo": "hitoDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de San Pedro»?",
    "opts": [
     "Abando",
     "Begoña",
     "Ibaiondo",
     "Deustu"
    ],
    "ans": 3,
    "info": "«Plaza de San Pedro» está en San Pedro de Deusto, distrito Deustu.",
    "tipo": "espacioDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/07/Conoce-DEUSTO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   }
  ]
 },
 {
  "nombre": "Arangoiti",
  "distrito": "Deustu",
  "lema": "El balcón verde sobre la ría",
  "pintxo": {
   "nombre": "Pintxo de txakoli de Arangoiti",
   "ingrediente": "txakoli",
   "color": "#e7c15a",
   "forma": 1
  },
  "fuentes": [
   "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
   "https://es.wikipedia.org/wiki/Arangoiti",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Arangoiti?",
    "opts": [
     "Uribarri",
     "Abando",
     "Ibaiondo",
     "Deustu"
    ],
    "ans": 3,
    "info": "Arangoiti forma parte del distrito Deustu.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Arangoiti en el padrón de 2023?",
    "opts": [
     "10.520",
     "9043",
     "4259",
     "5491"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 4259 habitantes en Arangoiti.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Arangoiti?",
    "opts": [
     "20 ha",
     "51 ha",
     "13 ha",
     "14 ha"
    ],
    "ans": 2,
    "info": "Arangoiti ocupa aproximadamente 13 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Arangoiti?",
    "opts": [
     "327,6 hab/ha",
     "478,1 hab/ha",
     "447,7 hab/ha",
     "315,5 hab/ha"
    ],
    "ans": 0,
    "info": "La densidad de Arangoiti ronda los 327,6 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Arangoiti?",
    "opts": [
     "Metro · Deustu (L1/L2)",
     "Solo autobús",
     "Metro · Indautxu (L1/L2)",
     "Metro · San Inazio (L1/L2)"
    ],
    "ans": 1,
    "info": "Arangoiti: Solo autobús. Solo autobús; ascensor de Arangoiti conecta con San Pedro de Deustu",
    "tipo": "access",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Arangoiti?",
    "opts": [
     "Ascensor de Arangoiti, rehabilitado en 2007",
     "Antiguas minas de hierro sobre las que se levantó el barrio",
     "Alto de Santo Domingo, mirador y paso del Camino de Santiago",
     "Grupo Cooperativo Arabella, levantado con la Ley de Casas Baratas de 1924"
    ],
    "ans": 0,
    "info": "«Ascensor de Arangoiti, rehabilitado en 2007» es un hito de Arangoiti.",
    "tipo": "hitoId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Ascensor de Arangoiti, rehabilitado en 2007»?",
    "opts": [
     "Larraskitu",
     "Arangoiti",
     "Monte Caramelo",
     "San Francisco"
    ],
    "ans": 1,
    "info": "«Ascensor de Arangoiti, rehabilitado en 2007» está en Arangoiti.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Arangoiti?",
    "opts": [
     "Mirador de Uretamendi",
     "Plaza de Garellano",
     "Espacios de la barriada y entorno del monte Banderas",
     "Parque de la República de Abando"
    ],
    "ans": 2,
    "info": "«Espacios de la barriada y entorno del monte Banderas» está en Arangoiti.",
    "tipo": "espacioId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Espacios de la barriada y entorno del monte Banderas»?",
    "opts": [
     "Bilbao La Vieja",
     "Arangoiti",
     "Matiko",
     "Uretamendi"
    ],
    "ans": 1,
    "info": "«Espacios de la barriada y entorno del monte Banderas» pertenece a Arangoiti.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Monte Banderas (223 m), en cuya falda se asienta el barrio»?",
    "opts": [
     "Atxuri",
     "Betolaza",
     "Matiko",
     "Arangoiti"
    ],
    "ans": 3,
    "info": "«Monte Banderas (223 m), en cuya falda se asienta el barrio» está en Arangoiti.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Arangoiti?",
    "opts": [
     "Zabala",
     "Iturralde",
     "San Pedro de Deusto",
     "Otxarkoaga"
    ],
    "ans": 2,
    "info": "Arangoiti y San Pedro de Deusto están en el distrito Deustu.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Deustu?",
    "opts": [
     "Betolaza",
     "Begoña",
     "Arangoiti",
     "Artxanda"
    ],
    "ans": 2,
    "info": "Arangoiti está en el distrito Deustu.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Arangoiti estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Arangoiti no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Arangoiti",
     "Santutxu",
     "Abando"
    ],
    "ans": 2,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Memoria del antiguo barrio y caseríos de Goiri y del convento de Capuchinos (s. XVIII)»?",
    "opts": [
     "Iturrigorri - Peñascal",
     "Arangoiti",
     "San Mamés",
     "Kastrexana"
    ],
    "ans": 1,
    "info": "«Memoria del antiguo barrio y caseríos de Goiri y del convento de Capuchinos (s. XVIII)» está en Arangoiti.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Ascensor de Arangoiti, rehabilitado en 2007»?",
    "opts": [
     "Abando",
     "Errekalde",
     "Begoña",
     "Deustu"
    ],
    "ans": 3,
    "info": "«Ascensor de Arangoiti, rehabilitado en 2007» está en Arangoiti, distrito Deustu.",
    "tipo": "hitoDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra «Espacios de la barriada y entorno del monte Banderas»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Deustu",
     "Uribarri",
     "Errekalde"
    ],
    "ans": 1,
    "info": "«Espacios de la barriada y entorno del monte Banderas» está en Arangoiti, distrito Deustu.",
    "tipo": "espacioDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-Arangoiti-caminando-v.3.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Txurdinaga",
     "Abando",
     "Arangoiti",
     "Zorrotza"
    ],
    "ans": 3,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Iturralde",
     "Solokoetxe",
     "Ametzola",
     "Arangoiti"
    ],
    "ans": 0,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Deustu?",
    "opts": [
     "San Pedro de Deusto",
     "Ibarrekolanda",
     "Uribarri",
     "Elorrieta"
    ],
    "ans": 2,
    "info": "Uribarri no está en Deustu.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Ibarrekolanda",
  "distrito": "Deustu",
  "lema": "Encrucijada viva del Botxo",
  "pintxo": {
   "nombre": "Pintxo de queso de oveja de Ibarrekolanda",
   "ingrediente": "queso de oveja",
   "color": "#f2d27a",
   "forma": 2
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-IBARREKOLANDA_SARRIKO-caminando.pdf",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://es.wikipedia.org/wiki/Ibarrecolanda",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Ibarrekolanda?",
    "opts": [
     "Uribarri",
     "Deustu",
     "Abando",
     "Ibaiondo"
    ],
    "ans": 1,
    "info": "Ibarrekolanda forma parte del distrito Deustu.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Ibarrekolanda en el padrón de 2023?",
    "opts": [
     "10.520",
     "5454",
     "14.851",
     "10.999"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 10.520 habitantes en Ibarrekolanda.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Ibarrekolanda?",
    "opts": [
     "32 ha",
     "40 ha",
     "18 ha",
     "60,1 ha"
    ],
    "ans": 1,
    "info": "Ibarrekolanda ocupa aproximadamente 40 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Ibarrekolanda?",
    "opts": [
     "93,3 hab/ha",
     "263 hab/ha",
     "143,7 hab/ha",
     "71,3 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Ibarrekolanda ronda los 263 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Ibarrekolanda?",
    "opts": [
     "Zurbaranbarri (L3)",
     "Sarriko (L1/L2)",
     "Abando (L1/L2)",
     "San Inazio (L1/L2)"
    ],
    "ans": 1,
    "info": "La estación de metro más próxima es Sarriko (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Ibarrekolanda?",
    "opts": [
     "Metro · Sarriko (L1/L2)",
     "Metro, tranvía, tren y autobús",
     "Metro · Matiko (L3)",
     "Metro · Indautxu (L1/L2)"
    ],
    "ans": 0,
    "info": "Ibarrekolanda: Metro · Sarriko (L1/L2). Estación Sarriko, con salida Ibarrekolanda",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Ibarrekolanda?",
    "opts": [
     "Pasarela Zubizuri de Santiago Calatrava",
     "Acceso al monte Pagasarri",
     "Casa-torre de Larrako, trasladada al parque de Sarriko en 1962",
     "Canal de Deusto (en servicio desde 1968)"
    ],
    "ans": 2,
    "info": "«Casa-torre de Larrako, trasladada al parque de Sarriko en 1962» es un hito de Ibarrekolanda.",
    "tipo": "hitoId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-IBARREKOLANDA_SARRIKO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Casa-torre de Larrako, trasladada al parque de Sarriko en 1962»?",
    "opts": [
     "Altamira",
     "Elorrieta",
     "Indautxu",
     "Ibarrekolanda"
    ],
    "ans": 3,
    "info": "«Casa-torre de Larrako, trasladada al parque de Sarriko en 1962» está en Ibarrekolanda.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-IBARREKOLANDA_SARRIKO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Ibarrekolanda?",
    "opts": [
     "Plaza de Levante",
     "Plaza principal del barrio",
     "Punta de Zorrotzaurre",
     "Parque de Sarriko"
    ],
    "ans": 3,
    "info": "«Parque de Sarriko» está en Ibarrekolanda.",
    "tipo": "espacioId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-IBARREKOLANDA_SARRIKO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Sarriko»?",
    "opts": [
     "Artxanda",
     "Ibarrekolanda",
     "Campuzano",
     "Albia"
    ],
    "ans": 1,
    "info": "«Parque de Sarriko» pertenece a Ibarrekolanda.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-IBARREKOLANDA_SARRIKO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Facultad de Economía y Empresa (Sarriko, 1962, Rafael Basterrechea)»?",
    "opts": [
     "Ibarrekolanda",
     "San Adrián",
     "Monte Caramelo",
     "Betolaza"
    ],
    "ans": 0,
    "info": "«Facultad de Economía y Empresa (Sarriko, 1962, Rafael Basterrechea)» está en Ibarrekolanda.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-IBARREKOLANDA_SARRIKO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Ibarrekolanda»?",
    "opts": [
     "Santutxu",
     "Otxarkoaga",
     "Errekaldeberri",
     "Ibarrekolanda"
    ],
    "ans": 3,
    "info": "«Plaza de Ibarrekolanda» pertenece a Ibarrekolanda.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-IBARREKOLANDA_SARRIKO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Ibarrekolanda?",
    "opts": [
     "Ametzola",
     "Matiko",
     "Zazpikaleak",
     "San Pedro de Deusto"
    ],
    "ans": 3,
    "info": "Ibarrekolanda y San Pedro de Deusto están en el distrito Deustu.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Deustu?",
    "opts": [
     "Ibarrekolanda",
     "Otxarkoaga",
     "San Mamés",
     "Santutxu"
    ],
    "ans": 0,
    "info": "Ibarrekolanda está en el distrito Deustu.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Ibarrekolanda estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: Sarriko (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Sarriko (L1/L2) da servicio a Ibarrekolanda?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, Sarriko (L1/L2) es la estación de metro de Ibarrekolanda.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Ibarrekolanda?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Ibarrekolanda.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Ibarrekolanda",
     "Santutxu",
     "Abando",
     "Indautxu"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Conservatorio Juan Crisóstomo de Arriaga (2007)»?",
    "opts": [
     "Zorrotzaurre",
     "Begoña",
     "Ibarrekolanda",
     "Arabella"
    ],
    "ans": 2,
    "info": "«Conservatorio Juan Crisóstomo de Arriaga (2007)» está en Ibarrekolanda.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-IBARREKOLANDA_SARRIKO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Sarrikoalde»?",
    "opts": [
     "Altamira",
     "Zurbaran",
     "Albia",
     "Ibarrekolanda"
    ],
    "ans": 3,
    "info": "«Plaza Sarrikoalde» pertenece a Ibarrekolanda.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/08/Conoce-IBARREKOLANDA_SARRIKO-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   }
  ]
 },
 {
  "nombre": "San Ignacio",
  "distrito": "Deustu",
  "lema": "Corazón obrero y alegre",
  "pintxo": {
   "nombre": "Pintxo de tortilla de San Ignacio",
   "ingrediente": "tortilla",
   "color": "#e08a4a",
   "forma": 3
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://es.wikipedia.org/wiki/San_Ignacio_(Bilbao)",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.visitbiscay.eus/es/iron-river/ruta-9-por-la-margen-derecha-de-la-ria/los-barrios-bilbainos-de-san-ignacio-y-elorrieta/historia"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de San Ignacio?",
    "opts": [
     "Basurtu-Zorrotza",
     "Abando",
     "Ibaiondo",
     "Deustu"
    ],
    "ans": 3,
    "info": "San Ignacio forma parte del distrito Deustu.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía San Ignacio en el padrón de 2023?",
    "opts": [
     "10.194",
     "3257",
     "12.691",
     "27.039"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 12.691 habitantes en San Ignacio.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué estación de metro da servicio a San Ignacio?",
    "opts": [
     "San Inazio (L1/L2)",
     "Santimami/San Mamés (L1/L2)",
     "Deustu (L1/L2)",
     "Bolueta (L1/L2)"
    ],
    "ans": 0,
    "info": "La estación de metro más próxima es San Inazio (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de San Ignacio?",
    "opts": [
     "Tren · Renfe Cercanías Olabeaga",
     "Solo autobús",
     "Metro, tranvía, tren y autobús",
     "Metro · San Inazio (L1/L2)"
    ],
    "ans": 3,
    "info": "San Ignacio: Metro · San Inazio (L1/L2). Estación San Inazio (salidas Asturias, Benita Asas, Lekeitio, Levante, todas en el barrio)",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de San Ignacio?",
    "opts": [
     "Estación de Atxuri (1913, Manuel María Smith), hoy cabecera del tranvía",
     "Estación de metro San Inazio",
     "Plaza proyectada en 1930 en honor a Emilio Campuzano",
     "El pretil o 'petril' y el antiguo camino de sirga"
    ],
    "ans": 1,
    "info": "«Estación de metro San Inazio» es un hito de San Ignacio.",
    "tipo": "hitoId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de metro San Inazio»?",
    "opts": [
     "Guggenheim - Ensanche",
     "San Ignacio",
     "Zabala",
     "Kastrexana"
    ],
    "ans": 1,
    "info": "«Estación de metro San Inazio» está en San Ignacio.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a San Ignacio?",
    "opts": [
     "Plaza principal del barrio",
     "Jardines de Solokoetxe",
     "Plaza de Levante",
     "Plaza de la Batalla de Padura"
    ],
    "ans": 2,
    "info": "«Plaza de Levante» está en San Ignacio.",
    "tipo": "espacioId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Levante»?",
    "opts": [
     "San Ignacio",
     "Ribera de Deusto",
     "Castaños",
     "Zorrotza"
    ],
    "ans": 0,
    "info": "«Plaza de Levante» pertenece a San Ignacio.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Mercado San Inazio-Ibarrekolanda»?",
    "opts": [
     "Arabella",
     "Zorrotzaurre",
     "San Ignacio",
     "Zurbaran"
    ],
    "ans": 2,
    "info": "«Mercado San Inazio-Ibarrekolanda» está en San Ignacio.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Sarriko (linde con Ibarrekolanda)»?",
    "opts": [
     "Iralabarri",
     "Zurbaran",
     "Begoña",
     "San Ignacio"
    ],
    "ans": 3,
    "info": "«Parque de Sarriko (linde con Ibarrekolanda)» pertenece a San Ignacio.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que San Ignacio?",
    "opts": [
     "San Pedro de Deusto",
     "Arabella",
     "Gurtubay",
     "Artxanda"
    ],
    "ans": 0,
    "info": "San Ignacio y San Pedro de Deusto están en el distrito Deustu.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Deustu?",
    "opts": [
     "Uretamendi",
     "San Ignacio",
     "Betolaza",
     "Zabala"
    ],
    "ans": 1,
    "info": "San Ignacio está en el distrito Deustu.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene San Ignacio estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: San Inazio (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro San Inazio (L1/L2) da servicio a San Ignacio?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, San Inazio (L1/L2) es la estación de metro de San Ignacio.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a San Ignacio?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de San Ignacio.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "San Ignacio",
     "Abando",
     "Santutxu",
     "Indautxu"
    ],
    "ans": 2,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Euskararen Etxea»?",
    "opts": [
     "San Ignacio",
     "Gurtubay",
     "Solokoetxe",
     "Bolueta"
    ],
    "ans": 0,
    "info": "«Euskararen Etxea» está en San Ignacio.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Espacios verdes y plazas interiores del polígono»?",
    "opts": [
     "Ciudad Jardín",
     "Zazpikaleak",
     "San Ignacio",
     "Santutxu"
    ],
    "ans": 2,
    "info": "«Espacios verdes y plazas interiores del polígono» pertenece a San Ignacio.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Estación de metro San Inazio»?",
    "opts": [
     "Errekalde",
     "Basurtu-Zorrotza",
     "Deustu",
     "Begoña"
    ],
    "ans": 2,
    "info": "«Estación de metro San Inazio» está en San Ignacio, distrito Deustu.",
    "tipo": "hitoDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de Levante»?",
    "opts": [
     "Abando",
     "Uribarri",
     "Begoña",
     "Deustu"
    ],
    "ans": 3,
    "info": "«Plaza de Levante» está en San Ignacio, distrito Deustu.",
    "tipo": "espacioDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2020/09/Conoce-SAN-INAZIO-caminando-v.2.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   }
  ]
 },
 {
  "nombre": "Elorrieta",
  "distrito": "Deustu",
  "lema": "El confín de los tranvías",
  "pintxo": {
   "nombre": "Pintxo de anchoa de Elorrieta",
   "ingrediente": "anchoa",
   "color": "#d9c37a",
   "forma": 4
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://es.wikipedia.org/wiki/Elorrieta",
   "https://es.wikipedia.org/wiki/San_Pedro_de_Deusto",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.visitbiscay.eus/es/iron-river/ruta-9-por-la-margen-derecha-de-la-ria/los-barrios-bilbainos-de-san-ignacio-y-elorrieta/historia"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Elorrieta?",
    "opts": [
     "Abando",
     "Basurtu-Zorrotza",
     "Ibaiondo",
     "Deustu"
    ],
    "ans": 3,
    "info": "Elorrieta forma parte del distrito Deustu.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Elorrieta en el padrón de 2023?",
    "opts": [
     "3257",
     "1273",
     "5571",
     "17.167"
    ],
    "ans": 1,
    "info": "El padrón municipal de 2023 registraba 1273 habitantes en Elorrieta.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Elorrieta?",
    "opts": [
     "Tren (FEVE) y autobús",
     "Metro · Santutxu (L1/L2)",
     "Solo autobús",
     "Metro · Uribarri (L3)"
    ],
    "ans": 2,
    "info": "Elorrieta: Solo autobús. Sin estación propia; la más cercana es San Inazio (L1/L2)",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Elorrieta?",
    "opts": [
     "Albergue de peregrinos del Camino Kobetas",
     "Estadio de San Mamés, 'La Catedral'",
     "Viacrucis y Calzadas de Mallona de subida a la basílica",
     "Estación de bombeo de Elorrieta (1900)"
    ],
    "ans": 3,
    "info": "«Estación de bombeo de Elorrieta (1900)» es un hito de Elorrieta.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de bombeo de Elorrieta (1900)»?",
    "opts": [
     "Gurtubay",
     "Elorrieta",
     "Albia",
     "Ametzola"
    ],
    "ans": 1,
    "info": "«Estación de bombeo de Elorrieta (1900)» está en Elorrieta.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Elorrieta?",
    "opts": [
     "Plaza Sarrikoalde",
     "Parque de la Encarnación",
     "Espacios verdes y plazas interiores del polígono",
     "Plaza de Elorrieta"
    ],
    "ans": 3,
    "info": "«Plaza de Elorrieta» está en Elorrieta.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Elorrieta»?",
    "opts": [
     "Arangoiti",
     "Mina del Morro",
     "Indautxu",
     "Elorrieta"
    ],
    "ans": 3,
    "info": "«Plaza de Elorrieta» pertenece a Elorrieta.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Casa Grande de Elorrieta (principios del s. XX)»?",
    "opts": [
     "Ametzola",
     "Elorrieta",
     "Uribarri",
     "Indautxu"
    ],
    "ans": 1,
    "info": "«Casa Grande de Elorrieta (principios del s. XX)» está en Elorrieta.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Jardines de Carmelo Larrea»?",
    "opts": [
     "Elorrieta",
     "Basurto",
     "Ametzola",
     "Ribera de Deusto"
    ],
    "ans": 0,
    "info": "«Jardines de Carmelo Larrea» pertenece a Elorrieta.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Elorrieta?",
    "opts": [
     "Mina del Morro",
     "Indautxu",
     "San Pedro de Deusto",
     "San Mamés"
    ],
    "ans": 2,
    "info": "Elorrieta y San Pedro de Deusto están en el distrito Deustu.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Deustu?",
    "opts": [
     "Elorrieta",
     "Guggenheim - Ensanche",
     "Zorrotza",
     "Zabala"
    ],
    "ans": 0,
    "info": "Elorrieta está en el distrito Deustu.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Elorrieta estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Elorrieta no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Elorrieta",
     "Abando",
     "Santutxu"
    ],
    "ans": 3,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Canal de Deusto (en servicio desde 1968)»?",
    "opts": [
     "Elorrieta",
     "Ametzola",
     "Albia",
     "Iralabarri"
    ],
    "ans": 0,
    "info": "«Canal de Deusto (en servicio desde 1968)» está en Elorrieta.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Estación de bombeo de Elorrieta (1900)»?",
    "opts": [
     "Deustu",
     "Basurtu-Zorrotza",
     "Errekalde",
     "Uribarri"
    ],
    "ans": 0,
    "info": "«Estación de bombeo de Elorrieta (1900)» está en Elorrieta, distrito Deustu.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de Elorrieta»?",
    "opts": [
     "Deustu",
     "Abando",
     "Otxarkoaga-Txurdinaga",
     "Ibaiondo"
    ],
    "ans": 0,
    "info": "«Plaza de Elorrieta» está en Elorrieta, distrito Deustu.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Deustu?",
    "opts": [
     "Ribera de Deusto",
     "Uribarri",
     "Ibarrekolanda",
     "Arangoiti"
    ],
    "ans": 1,
    "info": "Uribarri no está en Deustu.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Estación de bombeo de Elorrieta (1900)» está en Elorrieta?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Elorrieta.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Elorrieta?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, ese hito no está en Elorrieta.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   },
   {
    "q": "¿El espacio «Plaza de Elorrieta» está en Elorrieta?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Elorrieta.",
    "tipo": "tfEspacioYes",
    "fuente": "https://es.wikipedia.org/wiki/Elorrieta",
    "fuenteTitulo": "Wikipedia: Elorrieta"
   }
  ]
 },
 {
  "nombre": "Zorrotzaurre",
  "distrito": "Deustu",
  "lema": "La isla del futuro y la vanguardia",
  "pintxo": {
   "nombre": "Pintxo de mejillón de Zorrotzaurre",
   "ingrediente": "mejillón",
   "color": "#f2d27a",
   "forma": 5
  },
  "fuentes": [
   "https://www.zorrotzaurre.com/",
   "https://www.zorrotzaurre.com/puente-frank-gehry",
   "https://es.wikipedia.org/wiki/Zorrotzaurre",
   "https://www.bilbaopedia.info/zorrotzaurre",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Zorrotzaurre?",
    "opts": [
     "Errekalde",
     "Begoña",
     "Ibaiondo",
     "Deustu"
    ],
    "ans": 3,
    "info": "Zorrotzaurre forma parte del distrito Deustu.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Zorrotzaurre en el padrón de 2023?",
    "opts": [
     "12.897",
     "7370",
     "5737",
     "452"
    ],
    "ans": 3,
    "info": "El padrón municipal de 2023 registraba 452 habitantes en Zorrotzaurre.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Zorrotzaurre?",
    "opts": [
     "12 ha",
     "18 ha",
     "60,1 ha",
     "79 ha"
    ],
    "ans": 2,
    "info": "Zorrotzaurre ocupa aproximadamente 60,1 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Zorrotzaurre?",
    "opts": [
     "222,8 hab/ha",
     "7,5 hab/ha",
     "277,3 hab/ha",
     "120,8 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Zorrotzaurre ronda los 7,5 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Zorrotzaurre?",
    "opts": [
     "Metro · Bolueta (L1/L2)",
     "Autobús y pasarelas peatonales",
     "Solo autobús",
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)"
    ],
    "ans": 1,
    "info": "Zorrotzaurre: Autobús y pasarelas peatonales. Sin metro ni tranvía; acceso en autobús y por pasarelas peatonales",
    "tipo": "access",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Zorrotzaurre?",
    "opts": [
     "Antiguos cuarteles de Garellano",
     "Canal de Deusto, abierto entre 1950 y 1968",
     "Torre Iberdrola, Torre Bizkaia y torres Isozaki Atea",
     "Museo de Bellas Artes de Bilbao, en el parque de Doña Casilda"
    ],
    "ans": 1,
    "info": "«Canal de Deusto, abierto entre 1950 y 1968» es un hito de Zorrotzaurre.",
    "tipo": "hitoId",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Canal de Deusto, abierto entre 1950 y 1968»?",
    "opts": [
     "Zorrotzaurre",
     "Santutxu",
     "Bilbao La Vieja",
     "Matiko"
    ],
    "ans": 0,
    "info": "«Canal de Deusto, abierto entre 1950 y 1968» está en Zorrotzaurre.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Zorrotzaurre?",
    "opts": [
     "Punta de Zorrotzaurre",
     "Plaza de la Salve",
     "Plaza de los Santos Juanes",
     "Jardines de Garai"
    ],
    "ans": 0,
    "info": "«Punta de Zorrotzaurre» está en Zorrotzaurre.",
    "tipo": "espacioId",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Punta de Zorrotzaurre»?",
    "opts": [
     "Larraskitu",
     "Zorrotzaurre",
     "Zabala",
     "Kastrexana"
    ],
    "ans": 1,
    "info": "«Punta de Zorrotzaurre» pertenece a Zorrotzaurre.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Antiguos astilleros y naves industriales»?",
    "opts": [
     "Zorrotzaurre",
     "Guggenheim - Ensanche",
     "Ciudad Jardín",
     "Txurdinaga"
    ],
    "ans": 0,
    "info": "«Antiguos astilleros y naves industriales» está en Zorrotzaurre.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de la Ribera de Deusto»?",
    "opts": [
     "Zorrotzaurre",
     "Albia",
     "Txurdinaga",
     "Elorrieta"
    ],
    "ans": 0,
    "info": "«Parque de la Ribera de Deusto» pertenece a Zorrotzaurre.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Zorrotzaurre?",
    "opts": [
     "Zurbaran",
     "Otxarkoaga",
     "San Pedro de Deusto",
     "Indautxu"
    ],
    "ans": 2,
    "info": "Zorrotzaurre y San Pedro de Deusto están en el distrito Deustu.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Deustu?",
    "opts": [
     "Ametzola",
     "Otxarkoaga",
     "Arabella",
     "Zorrotzaurre"
    ],
    "ans": 3,
    "info": "Zorrotzaurre está en el distrito Deustu.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Zorrotzaurre estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Zorrotzaurre no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Santutxu",
     "Abando",
     "Zorrotzaurre"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Plan urbanístico de Zaha Hadid para la isla»?",
    "opts": [
     "Monte Caramelo",
     "Zorrotzaurre",
     "Olabeaga",
     "La Peña"
    ],
    "ans": 1,
    "info": "«Plan urbanístico de Zaha Hadid para la isla» está en Zorrotzaurre. El master plan de Zorrotzaurre fue encargado al estudio de Zaha Hadid.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Paseo del Canal de Deusto»?",
    "opts": [
     "Zorrotzaurre",
     "Indautxu",
     "Olabeaga",
     "San Pedro de Deusto"
    ],
    "ans": 0,
    "info": "«Paseo del Canal de Deusto» pertenece a Zorrotzaurre.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Canal de Deusto, abierto entre 1950 y 1968»?",
    "opts": [
     "Errekalde",
     "Deustu",
     "Ibaiondo",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 1,
    "info": "«Canal de Deusto, abierto entre 1950 y 1968» está en Zorrotzaurre, distrito Deustu.",
    "tipo": "hitoDistrito",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué distrito se encuentra «Punta de Zorrotzaurre»?",
    "opts": [
     "Basurtu-Zorrotza",
     "Deustu",
     "Ibaiondo",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 1,
    "info": "«Punta de Zorrotzaurre» está en Zorrotzaurre, distrito Deustu.",
    "tipo": "espacioDistrito",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Zorrotzaurre",
     "Txurdinaga",
     "Zorrotza",
     "Abando"
    ],
    "ans": 2,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Ribera de Deusto",
  "distrito": "Deustu",
  "lema": "Salitre, talleres y alma fluvial",
  "pintxo": {
   "nombre": "Pintxo de salmón de Ribera de Deusto",
   "ingrediente": "salmón",
   "color": "#e08a4a",
   "forma": 0
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://portusonline.org/la-ribera-de-deusto-un-barrio-reflejado-en-la-ria/",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.bilbaopedia.info/zorrotzaurre",
   "https://www.itsasmuseum.eus/descargas/maritimidades/05-La%20Ribera%20de%20Deusto%20y%20Zorrotzaurre%20en%20la%20R%C3%ADa%20de%20Bilbao%202024.pdf"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Ribera de Deusto?",
    "opts": [
     "Errekalde",
     "Basurtu-Zorrotza",
     "Deustu",
     "Begoña"
    ],
    "ans": 2,
    "info": "Ribera de Deusto forma parte del distrito Deustu.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Ribera de Deusto en el padrón de 2023?",
    "opts": [
     "5261",
     "1310",
     "388",
     "10.194"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 388 habitantes en Ribera de Deusto.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Ribera de Deusto?",
    "opts": [
     "Solo autobús",
     "Autobús y pasarelas peatonales",
     "Metro · San Inazio (L1/L2)",
     "Metro (Moyua y Abando)"
    ],
    "ans": 0,
    "info": "Ribera de Deusto: Solo autobús. Zorrotzaurre; sin estación propia, acceso por autobús y pasarelas",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Ribera de Deusto?",
    "opts": [
     "Canal de Deusto (1950-1968), que convirtió Zorrotzaurre en isla",
     "Museo de Bellas Artes de Bilbao",
     "Punta o 'puntal' de Zorrotza, en la confluencia del Cadagua y el Nervión",
     "Estación Zurbaranbarri de la L3"
    ],
    "ans": 0,
    "info": "«Canal de Deusto (1950-1968), que convirtió Zorrotzaurre en isla» es un hito de Ribera de Deusto.",
    "tipo": "hitoId",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Canal de Deusto (1950-1968), que convirtió Zorrotzaurre en isla»?",
    "opts": [
     "Ribera de Deusto",
     "Atxuri",
     "Zorrotzaurre",
     "Begoña"
    ],
    "ans": 0,
    "info": "«Canal de Deusto (1950-1968), que convirtió Zorrotzaurre en isla» está en Ribera de Deusto.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Ribera de Deusto?",
    "opts": [
     "Plaza Zuricalday y plaza de la Concordia",
     "Plaza Eugenio Olabarrieta",
     "Calzada medieval de Kastrexana",
     "Área deportiva de la plaza de la Encarnación"
    ],
    "ans": 1,
    "info": "«Plaza Eugenio Olabarrieta» está en Ribera de Deusto.",
    "tipo": "espacioId",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Eugenio Olabarrieta»?",
    "opts": [
     "Bilbao La Vieja",
     "Mina del Morro",
     "Arabella",
     "Ribera de Deusto"
    ],
    "ans": 3,
    "info": "«Plaza Eugenio Olabarrieta» pertenece a Ribera de Deusto.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Molinos Vascos, en el solar del Arsenal Real de Zorrotza»?",
    "opts": [
     "Basurto",
     "Ribera de Deusto",
     "San Pedro de Deusto",
     "Santutxu"
    ],
    "ans": 1,
    "info": "«Molinos Vascos, en el solar del Arsenal Real de Zorrotza» está en Ribera de Deusto.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plazuela Yolanda González»?",
    "opts": [
     "Uribarri",
     "Ciudad Jardín",
     "Ribera de Deusto",
     "Ametzola"
    ],
    "ans": 2,
    "info": "«Plazuela Yolanda González» pertenece a Ribera de Deusto.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Ribera de Deusto?",
    "opts": [
     "San Pedro de Deusto",
     "Matiko",
     "Begoña",
     "La Peña"
    ],
    "ans": 0,
    "info": "Ribera de Deusto y San Pedro de Deusto están en el distrito Deustu.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Deustu?",
    "opts": [
     "Errekaldeberri",
     "Artxanda",
     "Indautxu",
     "Ribera de Deusto"
    ],
    "ans": 3,
    "info": "Ribera de Deusto está en el distrito Deustu.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Ribera de Deusto estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Ribera de Deusto no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Abando",
     "Indautxu",
     "Ribera de Deusto",
     "Santutxu"
    ],
    "ans": 3,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Vicinay Cadenas y antiguos astilleros de la Ribera»?",
    "opts": [
     "Ribera de Deusto",
     "Arabella",
     "Guggenheim - Ensanche",
     "Atxuri"
    ],
    "ans": 0,
    "info": "«Vicinay Cadenas y antiguos astilleros de la Ribera» está en Ribera de Deusto.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Skatepark de Ribera de Deusto»?",
    "opts": [
     "Zabala",
     "San Ignacio",
     "Ribera de Deusto",
     "Atxuri"
    ],
    "ans": 2,
    "info": "«Skatepark de Ribera de Deusto» pertenece a Ribera de Deusto.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Canal de Deusto (1950-1968), que convirtió Zorrotzaurre en isla»?",
    "opts": [
     "Uribarri",
     "Otxarkoaga-Txurdinaga",
     "Deustu",
     "Begoña"
    ],
    "ans": 2,
    "info": "«Canal de Deusto (1950-1968), que convirtió Zorrotzaurre en isla» está en Ribera de Deusto, distrito Deustu.",
    "tipo": "hitoDistrito",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza Eugenio Olabarrieta»?",
    "opts": [
     "Begoña",
     "Basurtu-Zorrotza",
     "Errekalde",
     "Deustu"
    ],
    "ans": 3,
    "info": "«Plaza Eugenio Olabarrieta» está en Ribera de Deusto, distrito Deustu.",
    "tipo": "espacioDistrito",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Deustu?",
    "opts": [
     "Uribarri",
     "Zorrotzaurre",
     "Arangoiti",
     "Ibarrekolanda"
    ],
    "ans": 0,
    "info": "Uribarri no está en Deustu.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_1.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Canal de Deusto (1950-1968), que convirtió Zorrotzaurre en isla» está en Ribera de Deusto?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Ribera de Deusto.",
    "tipo": "tfHitoYes",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Ribera de Deusto?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese hito no está en Ribera de Deusto.",
    "tipo": "tfHitoNo",
    "fuente": "https://www.bilbaopedia.info/zorrotzaurre",
    "fuenteTitulo": "bilbaopedia.info"
   }
  ]
 },
 {
  "nombre": "Uribarri",
  "distrito": "Uribarri",
  "lema": "La cuesta hacia los cielos",
  "pintxo": {
   "nombre": "Pintxo de chorizo de Uribarri",
   "ingrediente": "chorizo",
   "color": "#ffd166",
   "forma": 1
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://euskotren.eus/sites/default/files/2024-12/L3.pdf",
   "https://konpartsauribarricas.wordpress.com/nuestro-barrio/",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Uribarri?",
    "opts": [
     "Uribarri",
     "Abando",
     "Errekalde",
     "Begoña"
    ],
    "ans": 0,
    "info": "Uribarri forma parte del distrito Uribarri.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Uribarri en el padrón de 2023?",
    "opts": [
     "3999",
     "10.520",
     "5737",
     "12.897"
    ],
    "ans": 3,
    "info": "El padrón municipal de 2023 registraba 12.897 habitantes en Uribarri.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Uribarri?",
    "opts": [
     "129 ha",
     "11 ha",
     "25 ha",
     "32 ha"
    ],
    "ans": 3,
    "info": "Uribarri ocupa aproximadamente 32 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Uribarri?",
    "opts": [
     "7,5 hab/ha",
     "403 hab/ha",
     "315,5 hab/ha",
     "206,3 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Uribarri ronda los 403 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Uribarri?",
    "opts": [
     "Uribarri (L3)",
     "Zurbaranbarri (L3)",
     "San Inazio (L1/L2)",
     "Abando (L1/L2)"
    ],
    "ans": 0,
    "info": "La estación de metro más próxima es Uribarri (L3).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Uribarri?",
    "opts": [
     "Tranvía · T1 Atxuri",
     "Funicular de Artxanda y autobús",
     "Metro · Deustu (L1/L2)",
     "Metro · Uribarri (L3)"
    ],
    "ans": 3,
    "info": "Uribarri: Metro · Uribarri (L3). Estación Uribarri (salidas Travesía Uribarri, Berriotxoa, Zumalakarregi, Escuelas)",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Uribarri?",
    "opts": [
     "Antiguos caseríos que dieron nombre a las calles, como el caserío Trauku",
     "Cargadero de Olabeaga (1894) y cargadero Gandarias",
     "Zonas históricas de Gardeazabal, Iturrigorri, Camino de Arraiz y Peñascal Alto",
     "Memoria de la isla de San Cristóbal, desaparecida tras el encauzamiento posterior a 1983"
    ],
    "ans": 0,
    "info": "«Antiguos caseríos que dieron nombre a las calles, como el caserío Trauku» es un hito de Uribarri.",
    "tipo": "hitoId",
    "fuente": "https://konpartsauribarricas.wordpress.com/nuestro-barrio/",
    "fuenteTitulo": "konpartsauribarricas.wordpress.com"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Antiguos caseríos que dieron nombre a las calles, como el caserío Trauku»?",
    "opts": [
     "Uribarri",
     "Albia",
     "Monte Caramelo",
     "Casco Viejo"
    ],
    "ans": 0,
    "info": "«Antiguos caseríos que dieron nombre a las calles, como el caserío Trauku» está en Uribarri.",
    "tipo": "hitoRev",
    "fuente": "https://konpartsauribarricas.wordpress.com/nuestro-barrio/",
    "fuenteTitulo": "konpartsauribarricas.wordpress.com"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Uribarri?",
    "opts": [
     "Campa de las Escuelas de Uribarri",
     "Calzada medieval de Kastrexana",
     "Pumptrack de Punta Zorrotza",
     "Zona de parkour y patinaje del Parque Sarriko"
    ],
    "ans": 0,
    "info": "«Campa de las Escuelas de Uribarri» está en Uribarri.",
    "tipo": "espacioId",
    "fuente": "https://konpartsauribarricas.wordpress.com/nuestro-barrio/",
    "fuenteTitulo": "konpartsauribarricas.wordpress.com"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Campa de las Escuelas de Uribarri»?",
    "opts": [
     "Betolaza",
     "Olabeaga",
     "Iturralde",
     "Uribarri"
    ],
    "ans": 3,
    "info": "«Campa de las Escuelas de Uribarri» pertenece a Uribarri.",
    "tipo": "espacioRev",
    "fuente": "https://konpartsauribarricas.wordpress.com/nuestro-barrio/",
    "fuenteTitulo": "konpartsauribarricas.wordpress.com"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de metro Uribarri (L3)»?",
    "opts": [
     "Bolueta",
     "Uribarri",
     "Masustegi",
     "Iralabarri"
    ],
    "ans": 1,
    "info": "«Estación de metro Uribarri (L3)» está en Uribarri.",
    "tipo": "hitoRev",
    "fuente": "https://konpartsauribarricas.wordpress.com/nuestro-barrio/",
    "fuenteTitulo": "konpartsauribarricas.wordpress.com"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de las Escuelas»?",
    "opts": [
     "Iturralde",
     "Uribarri",
     "Indautxu",
     "Atxuri"
    ],
    "ans": 1,
    "info": "«Plaza de las Escuelas» pertenece a Uribarri.",
    "tipo": "espacioRev",
    "fuente": "https://konpartsauribarricas.wordpress.com/nuestro-barrio/",
    "fuenteTitulo": "konpartsauribarricas.wordpress.com"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Uribarri?",
    "opts": [
     "Matiko",
     "Ribera de Deusto",
     "Olabeaga",
     "Mina del Morro"
    ],
    "ans": 0,
    "info": "Uribarri y Matiko están en el distrito Uribarri.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Uribarri?",
    "opts": [
     "Elorrieta",
     "Uretamendi",
     "Uribarri",
     "Iralabarri"
    ],
    "ans": 2,
    "info": "Uribarri está en el distrito Uribarri.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Uribarri estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Uribarri (L3).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Uribarri (L3) da servicio a Uribarri?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Uribarri (L3) es la estación de metro de Uribarri.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Uribarri?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, Deustu (L1/L2) no es la estación de Uribarri.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Uribarri",
     "Indautxu",
     "Abando"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Vinculación histórica con la anteiglesia de Begoña»?",
    "opts": [
     "Ibarrekolanda",
     "Zorrotza",
     "Uribarri",
     "Altamira"
    ],
    "ans": 2,
    "info": "«Vinculación histórica con la anteiglesia de Begoña» está en Uribarri.",
    "tipo": "hitoRev",
    "fuente": "https://konpartsauribarricas.wordpress.com/nuestro-barrio/",
    "fuenteTitulo": "konpartsauribarricas.wordpress.com"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Antiguos caseríos que dieron nombre a las calles, como el caserío Trauku»?",
    "opts": [
     "Errekalde",
     "Otxarkoaga-Txurdinaga",
     "Basurtu-Zorrotza",
     "Uribarri"
    ],
    "ans": 3,
    "info": "«Antiguos caseríos que dieron nombre a las calles, como el caserío Trauku» está en Uribarri, distrito Uribarri.",
    "tipo": "hitoDistrito",
    "fuente": "https://konpartsauribarricas.wordpress.com/nuestro-barrio/",
    "fuenteTitulo": "konpartsauribarricas.wordpress.com"
   }
  ]
 },
 {
  "nombre": "Matiko",
  "distrito": "Uribarri",
  "lema": "Pasadizo entre túneles y plazuelas",
  "pintxo": {
   "nombre": "Pintxo de pimiento de Matiko",
   "ingrediente": "pimiento",
   "color": "#d9c37a",
   "forma": 2
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://es.wikipedia.org/wiki/Bilbao-Matiko",
   "https://es.wikipedia.org/wiki/Matico-Ciudad_Jard%C3%ADn",
   "https://euskotren.eus/sites/default/files/2024-12/L3.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Matiko?",
    "opts": [
     "Uribarri",
     "Abando",
     "Errekalde",
     "Deustu"
    ],
    "ans": 0,
    "info": "Matiko forma parte del distrito Uribarri.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Matiko en el padrón de 2023?",
    "opts": [
     "3882",
     "10.194",
     "5261",
     "24.135"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 5261 habitantes en Matiko.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué estación de metro da servicio a Matiko?",
    "opts": [
     "Matiko (L3)",
     "Santutxu (L1/L2)",
     "Uribarri (L3)",
     "Zazpikaleak/Casco Viejo (L1/L2/L3)"
    ],
    "ans": 0,
    "info": "La estación de metro más próxima es Matiko (L3).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Matiko?",
    "opts": [
     "Metro · Otxarkoaga (L3)",
     "Metro · San Inazio (L1/L2)",
     "Metro · Matiko (L3)",
     "Tren · Renfe Cercanías Zorrotza (C-1/C-2/C-4)"
    ],
    "ans": 2,
    "info": "Matiko: Metro · Matiko (L3). Estación de Matiko (metro L3 y Euskotren)",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Matiko?",
    "opts": [
     "Museo de Bellas Artes de Bilbao",
     "Estación de Matiko, con instalaciones originales de 1887",
     "Estación de bombeo de Elorrieta (1900)",
     "Canal de Deusto, abierto entre 1950 y 1968"
    ],
    "ans": 1,
    "info": "«Estación de Matiko, con instalaciones originales de 1887» es un hito de Matiko.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao-Matiko",
    "fuenteTitulo": "Wikipedia: Bilbao-Matiko"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de Matiko, con instalaciones originales de 1887»?",
    "opts": [
     "La Peña",
     "Santutxu",
     "San Ignacio",
     "Matiko"
    ],
    "ans": 3,
    "info": "«Estación de Matiko, con instalaciones originales de 1887» está en Matiko.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao-Matiko",
    "fuenteTitulo": "Wikipedia: Bilbao-Matiko"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Matiko?",
    "opts": [
     "Plaza de Moraza",
     "Plaza de Zumárraga",
     "Paseo de la ría",
     "Parque de Etxebarria (acceso por Mallona)"
    ],
    "ans": 0,
    "info": "«Plaza de Moraza» está en Matiko.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao-Matiko",
    "fuenteTitulo": "Wikipedia: Bilbao-Matiko"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Moraza»?",
    "opts": [
     "Matiko",
     "Arabella",
     "Zorrotza",
     "San Ignacio"
    ],
    "ans": 0,
    "info": "«Plaza de Moraza» pertenece a Matiko.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao-Matiko",
    "fuenteTitulo": "Wikipedia: Bilbao-Matiko"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Ascensor de la calle Tíboli hacia el funicular de Artxanda»?",
    "opts": [
     "Uretamendi",
     "Bilbao La Vieja",
     "Matiko",
     "Uribarri"
    ],
    "ans": 2,
    "info": "«Ascensor de la calle Tíboli hacia el funicular de Artxanda» está en Matiko.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao-Matiko",
    "fuenteTitulo": "Wikipedia: Bilbao-Matiko"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Uzturre»?",
    "opts": [
     "Matiko",
     "Zabala",
     "Zazpikaleak",
     "Abando"
    ],
    "ans": 0,
    "info": "«Plaza de Uzturre» pertenece a Matiko.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao-Matiko",
    "fuenteTitulo": "Wikipedia: Bilbao-Matiko"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Matiko?",
    "opts": [
     "Miribilla",
     "Campuzano",
     "Uribarri",
     "Guggenheim - Ensanche"
    ],
    "ans": 2,
    "info": "Matiko y Uribarri están en el distrito Uribarri.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Uribarri?",
    "opts": [
     "Larraskitu",
     "Matiko",
     "Campuzano",
     "San Pedro de Deusto"
    ],
    "ans": 1,
    "info": "Matiko está en el distrito Uribarri.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Matiko estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: Matiko (L3).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Matiko (L3) da servicio a Matiko?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Matiko (L3) es la estación de metro de Matiko.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Matiko?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, Deustu (L1/L2) no es la estación de Matiko.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Matiko",
     "Indautxu",
     "Abando"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Conjunto de viviendas de Ciudad Jardín de Pedro Ispizua (colindante)»?",
    "opts": [
     "Casco Viejo",
     "Matiko",
     "San Mamés",
     "Guggenheim - Ensanche"
    ],
    "ans": 1,
    "info": "«Conjunto de viviendas de Ciudad Jardín de Pedro Ispizua (colindante)» está en Matiko.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao-Matiko",
    "fuenteTitulo": "Wikipedia: Bilbao-Matiko"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Estación de Matiko, con instalaciones originales de 1887»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Uribarri",
     "Deustu",
     "Basurtu-Zorrotza"
    ],
    "ans": 1,
    "info": "«Estación de Matiko, con instalaciones originales de 1887» está en Matiko, distrito Uribarri.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao-Matiko",
    "fuenteTitulo": "Wikipedia: Bilbao-Matiko"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de Moraza»?",
    "opts": [
     "Abando",
     "Errekalde",
     "Ibaiondo",
     "Uribarri"
    ],
    "ans": 3,
    "info": "«Plaza de Moraza» está en Matiko, distrito Uribarri.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao-Matiko",
    "fuenteTitulo": "Wikipedia: Bilbao-Matiko"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Uribarri?",
    "opts": [
     "Ciudad Jardín",
     "San Pedro de Deusto",
     "Castaños",
     "Uribarri"
    ],
    "ans": 1,
    "info": "San Pedro de Deusto no está en Uribarri.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Ciudad Jardín",
  "distrito": "Uribarri",
  "lema": "El oasis de tejas rojas",
  "pintxo": {
   "nombre": "Pintxo de aceituna de Ciudad Jardín",
   "ingrediente": "aceituna",
   "color": "#e7c15a",
   "forma": 3
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Ciudad Jardín?",
    "opts": [
     "Ibaiondo",
     "Uribarri",
     "Deustu",
     "Errekalde"
    ],
    "ans": 1,
    "info": "Ciudad Jardín forma parte del distrito Uribarri.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Ciudad Jardín en el padrón de 2023?",
    "opts": [
     "5491",
     "590",
     "7331",
     "388"
    ],
    "ans": 1,
    "info": "El padrón municipal de 2023 registraba 590 habitantes en Ciudad Jardín.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Ciudad Jardín?",
    "opts": [
     "Metro, tranvía, tren y autobús",
     "Solo autobús",
     "Metro (Indautxu)",
     "Metro · Indautxu (L1/L2)"
    ],
    "ans": 1,
    "info": "Ciudad Jardín: Solo autobús. Solo autobús; el apeadero de Loruri-Ciudad Jardín desapareció en 2015",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Ciudad Jardín?",
    "opts": [
     "Urbanización Ciudad Jardín, de Pedro Ispizua Susunaga, en estilo regionalista neovasco",
     "Museo de Pasos de Semana Santa de Bilbao",
     "Mercado de la Ribera, la mayor plaza de abastos cubierta de Europa",
     "Mercado San Inazio-Ibarrekolanda"
    ],
    "ans": 0,
    "info": "«Urbanización Ciudad Jardín, de Pedro Ispizua Susunaga, en estilo regionalista neovasco» es un hito de Ciudad Jardín.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Urbanización Ciudad Jardín, de Pedro Ispizua Susunaga, en estilo regionalista neovasco»?",
    "opts": [
     "Altamira",
     "Iturralde",
     "Ciudad Jardín",
     "San Pedro de Deusto"
    ],
    "ans": 2,
    "info": "«Urbanización Ciudad Jardín, de Pedro Ispizua Susunaga, en estilo regionalista neovasco» está en Ciudad Jardín.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Ciudad Jardín?",
    "opts": [
     "Parque de Sarriko",
     "Plaza de Neguruela",
     "Plaza Elíptica (Moyúa)",
     "Plaza de las Escuelas"
    ],
    "ans": 1,
    "info": "«Plaza de Neguruela» está en Ciudad Jardín.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Neguruela»?",
    "opts": [
     "Ciudad Jardín",
     "Zorrotza",
     "San Adrián",
     "Albia"
    ],
    "ans": 0,
    "info": "«Plaza de Neguruela» pertenece a Ciudad Jardín.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «56 edificios bifamiliares de dos plantas»?",
    "opts": [
     "Zurbaran",
     "San Pedro de Deusto",
     "Iturralde",
     "Ciudad Jardín"
    ],
    "ans": 3,
    "info": "«56 edificios bifamiliares de dos plantas» está en Ciudad Jardín.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza con centro social de la urbanización y red de senderos»?",
    "opts": [
     "Masustegi",
     "Betolaza",
     "Ciudad Jardín",
     "Ametzola"
    ],
    "ans": 2,
    "info": "«Plaza con centro social de la urbanización y red de senderos» pertenece a Ciudad Jardín.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Ciudad Jardín?",
    "opts": [
     "Begoña",
     "Uribarri",
     "Basurto",
     "Errekaldeberri"
    ],
    "ans": 1,
    "info": "Ciudad Jardín y Uribarri están en el distrito Uribarri.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Uribarri?",
    "opts": [
     "Mina del Morro",
     "Miribilla",
     "Albia",
     "Ciudad Jardín"
    ],
    "ans": 3,
    "info": "Ciudad Jardín está en el distrito Uribarri.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Ciudad Jardín estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Ciudad Jardín no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Ciudad Jardín",
     "Santutxu",
     "Indautxu",
     "Abando"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Monte Artxanda»?",
    "opts": [
     "Ciudad Jardín",
     "Masustegi",
     "San Pedro de Deusto",
     "San Adrián"
    ],
    "ans": 0,
    "info": "«Monte Artxanda» está en Ciudad Jardín.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Urbanización Ciudad Jardín, de Pedro Ispizua Susunaga, en estilo regionalista neovasco»?",
    "opts": [
     "Errekalde",
     "Uribarri",
     "Begoña",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 1,
    "info": "«Urbanización Ciudad Jardín, de Pedro Ispizua Susunaga, en estilo regionalista neovasco» está en Ciudad Jardín, distrito Uribarri.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de Neguruela»?",
    "opts": [
     "Errekalde",
     "Deustu",
     "Otxarkoaga-Txurdinaga",
     "Uribarri"
    ],
    "ans": 3,
    "info": "«Plaza de Neguruela» está en Ciudad Jardín, distrito Uribarri.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Uribarri?",
    "opts": [
     "Artxanda",
     "Uribarri",
     "Arabella",
     "San Pedro de Deusto"
    ],
    "ans": 3,
    "info": "San Pedro de Deusto no está en Uribarri.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Urbanización Ciudad Jardín, de Pedro Ispizua Susunaga, en estilo regionalista neovasco» está en Ciudad Jardín?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Ciudad Jardín.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Ciudad Jardín?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese hito no está en Ciudad Jardín.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   },
   {
    "q": "¿El espacio «Plaza de Neguruela» está en Ciudad Jardín?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Ciudad Jardín.",
    "tipo": "tfEspacioYes",
    "fuente": "https://es.wikipedia.org/wiki/Ciudad_Jard%C3%ADn_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Ciudad Jardín (Bilbao)"
   }
  ]
 },
 {
  "nombre": "Castaños",
  "distrito": "Uribarri",
  "lema": "Sombra apacible al pie del funicular",
  "pintxo": {
   "nombre": "Pintxo de castaña de Castaños",
   "ingrediente": "castaña",
   "color": "#f0d27a",
   "forma": 4
  },
  "fuentes": [
   "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.ondavasca.com/castanos-algo-mas-que-el-barrio-del-funicular/"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Castaños?",
    "opts": [
     "Ibaiondo",
     "Basurtu-Zorrotza",
     "Otxarkoaga-Txurdinaga",
     "Uribarri"
    ],
    "ans": 3,
    "info": "Castaños forma parte del distrito Uribarri.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Castaños en el padrón de 2023?",
    "opts": [
     "1273",
     "10.520",
     "5571",
     "3882"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 5571 habitantes en Castaños.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Castaños?",
    "opts": [
     "25 ha",
     "55 ha",
     "20 ha",
     "14 ha"
    ],
    "ans": 0,
    "info": "Castaños ocupa aproximadamente 25 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Castaños?",
    "opts": [
     "85,3 hab/ha",
     "222,8 hab/ha",
     "327,6 hab/ha",
     "478,1 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Castaños ronda los 222,8 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Castaños?",
    "opts": [
     "Metro · Sarriko (L1/L2)",
     "Funicular de Artxanda y autobús",
     "Solo autobús",
     "Tren · Renfe Cercanías Ametzola"
    ],
    "ans": 2,
    "info": "Castaños: Solo autobús. Solo autobús; Funicular de Artxanda desde la Plaza del Funicular",
    "tipo": "access",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Castaños?",
    "opts": [
     "Paseo-mirador y pérgolas con cilindros-linterna sobre el trazado ferroviario",
     "Casa-torre de Larrako, trasladada al parque de Sarriko en 1962",
     "Funicular de Artxanda (1915)",
     "Antiguo estadio de San Mamés (1913-2013)"
    ],
    "ans": 2,
    "info": "«Funicular de Artxanda (1915)» es un hito de Castaños.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Funicular de Artxanda (1915)»?",
    "opts": [
     "Castaños",
     "Bilbao La Vieja",
     "Betolaza",
     "Masustegi"
    ],
    "ans": 0,
    "info": "«Funicular de Artxanda (1915)» está en Castaños.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Castaños?",
    "opts": [
     "Plaza de Urizar",
     "Plaza de Matos",
     "Parque de Ibaieder, con tirolina y zona de skate",
     "Plaza del Funicular"
    ],
    "ans": 3,
    "info": "«Plaza del Funicular» está en Castaños.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza del Funicular»?",
    "opts": [
     "Ribera de Deusto",
     "Larraskitu",
     "Castaños",
     "Elorrieta"
    ],
    "ans": 2,
    "info": "«Plaza del Funicular» pertenece a Castaños.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Pasarela Zubizuri de Santiago Calatrava»?",
    "opts": [
     "Castaños",
     "Errekaldeberri",
     "Zazpikaleak",
     "Masustegi"
    ],
    "ans": 0,
    "info": "«Pasarela Zubizuri de Santiago Calatrava» está en Castaños.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de la Salve»?",
    "opts": [
     "Basurto",
     "Castaños",
     "Kastrexana",
     "Abando"
    ],
    "ans": 1,
    "info": "«Plaza de la Salve» pertenece a Castaños.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Castaños?",
    "opts": [
     "Casco Viejo",
     "Uribarri",
     "San Mamés",
     "Iturrigorri - Peñascal"
    ],
    "ans": 1,
    "info": "Castaños y Uribarri están en el distrito Uribarri.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Uribarri?",
    "opts": [
     "Monte Caramelo",
     "Bilbao La Vieja",
     "Uretamendi",
     "Castaños"
    ],
    "ans": 3,
    "info": "Castaños está en el distrito Uribarri.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Castaños estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Castaños no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Santutxu",
     "Abando",
     "Castaños"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Puente de La Salve»?",
    "opts": [
     "Monte Caramelo",
     "Castaños",
     "San Adrián",
     "Campuzano"
    ],
    "ans": 1,
    "info": "«Puente de La Salve» está en Castaños.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Funicular de Artxanda (1915)»?",
    "opts": [
     "Errekalde",
     "Uribarri",
     "Basurtu-Zorrotza",
     "Deustu"
    ],
    "ans": 1,
    "info": "«Funicular de Artxanda (1915)» está en Castaños, distrito Uribarri.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza del Funicular»?",
    "opts": [
     "Basurtu-Zorrotza",
     "Errekalde",
     "Uribarri",
     "Abando"
    ],
    "ans": 2,
    "info": "«Plaza del Funicular» está en Castaños, distrito Uribarri.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Casta%C3%B1os_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Castaños (Bilbao)"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Castaños",
     "Txurdinaga",
     "Abando",
     "Zorrotza"
    ],
    "ans": 3,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Ametzola",
     "Solokoetxe",
     "Iturralde",
     "Castaños"
    ],
    "ans": 2,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Zurbaran",
  "distrito": "Uribarri",
  "lema": "Escaleras que abrazan la ladera",
  "pintxo": {
   "nombre": "Pintxo de morcilla de Zurbaran",
   "ingrediente": "morcilla",
   "color": "#ffd166",
   "forma": 5
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "http://www.bilbao.eus/hezkuntza/zurbaranlh/historia.htm",
   "https://ca.wikipedia.org/wiki/Zurbaran",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://euskotren.eus/sites/default/files/2024-12/L3.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Zurbaran?",
    "opts": [
     "Deustu",
     "Uribarri",
     "Errekalde",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 1,
    "info": "Zurbaran forma parte del distrito Uribarri.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Zurbaran en el padrón de 2023?",
    "opts": [
     "5491",
     "5571",
     "9679",
     "14.772"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 9679 habitantes en Zurbaran.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué estación de metro da servicio a Zurbaran?",
    "opts": [
     "San Inazio (L1/L2)",
     "Matiko (L3)",
     "Santimami/San Mamés (L1/L2)",
     "Zurbaranbarri (L3)"
    ],
    "ans": 3,
    "info": "La estación de metro más próxima es Zurbaranbarri (L3).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Zurbaran?",
    "opts": [
     "Metro · Zurbaranbarri (L3)",
     "Metro (Indautxu)",
     "Tren · Renfe Cercanías Miribilla",
     "Autobús y pasarelas peatonales"
    ],
    "ans": 0,
    "info": "Zurbaran: Metro · Zurbaranbarri (L3). Estación Zurbaranbarri (salidas Zumaia y Vía Vieja de Lezama)",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Zurbaran?",
    "opts": [
     "Vinculación histórica con la anteiglesia de Begoña",
     "Estadio de San Mamés, 'La Catedral'",
     "Estación y centro comercial bajo la plaza de Indautxu",
     "Estación Zurbaranbarri de la L3"
    ],
    "ans": 3,
    "info": "«Estación Zurbaranbarri de la L3» es un hito de Zurbaran.",
    "tipo": "hitoId",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación Zurbaranbarri de la L3»?",
    "opts": [
     "Zurbaran",
     "Iturralde",
     "Miribilla",
     "Kastrexana"
    ],
    "ans": 0,
    "info": "«Estación Zurbaranbarri de la L3» está en Zurbaran.",
    "tipo": "hitoRev",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Zurbaran?",
    "opts": [
     "Plaza de Zumárraga",
     "Parque de Doña Casilda Iturrizar",
     "Jardines de La Floresta",
     "Plaza Guridi"
    ],
    "ans": 3,
    "info": "«Plaza Guridi» está en Zurbaran.",
    "tipo": "espacioId",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Guridi»?",
    "opts": [
     "Indautxu",
     "Zurbaran",
     "Solokoetxe",
     "Castaños"
    ],
    "ans": 1,
    "info": "«Plaza Guridi» pertenece a Zurbaran.",
    "tipo": "espacioRev",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Memoria de la casa-torre de la familia Zurbaran, en la anteiglesia de Begoña»?",
    "opts": [
     "San Ignacio",
     "Zurbaran",
     "Campuzano",
     "San Francisco"
    ],
    "ans": 1,
    "info": "«Memoria de la casa-torre de la familia Zurbaran, en la anteiglesia de Begoña» está en Zurbaran.",
    "tipo": "hitoRev",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Iturriondo»?",
    "opts": [
     "Basurto",
     "Larraskitu",
     "Bolueta",
     "Zurbaran"
    ],
    "ans": 3,
    "info": "«Plaza Iturriondo» pertenece a Zurbaran.",
    "tipo": "espacioRev",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Zurbaran?",
    "opts": [
     "Zorrotzaurre",
     "Uribarri",
     "San Mamés",
     "San Adrián"
    ],
    "ans": 1,
    "info": "Zurbaran y Uribarri están en el distrito Uribarri.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Uribarri?",
    "opts": [
     "Gurtubay",
     "Zurbaran",
     "San Pedro de Deusto",
     "Albia"
    ],
    "ans": 1,
    "info": "Zurbaran está en el distrito Uribarri.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Zurbaran estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: Zurbaranbarri (L3).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Zurbaranbarri (L3) da servicio a Zurbaran?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Zurbaranbarri (L3) es la estación de metro de Zurbaran.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Zurbaran?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Zurbaran.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Zurbaran",
     "Indautxu",
     "Abando"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Basílica de Begoña, referencia del entorno»?",
    "opts": [
     "Bolueta",
     "Olabeaga",
     "Ciudad Jardín",
     "Zurbaran"
    ],
    "ans": 3,
    "info": "«Basílica de Begoña, referencia del entorno» está en Zurbaran.",
    "tipo": "hitoRev",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Juan XXIII»?",
    "opts": [
     "Bolueta",
     "Zabala",
     "San Adrián",
     "Zurbaran"
    ],
    "ans": 3,
    "info": "«Plaza Juan XXIII» pertenece a Zurbaran.",
    "tipo": "espacioRev",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Estación Zurbaranbarri de la L3»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Uribarri",
     "Deustu",
     "Errekalde"
    ],
    "ans": 1,
    "info": "«Estación Zurbaranbarri de la L3» está en Zurbaran, distrito Uribarri.",
    "tipo": "hitoDistrito",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza Guridi»?",
    "opts": [
     "Ibaiondo",
     "Uribarri",
     "Otxarkoaga-Txurdinaga",
     "Errekalde"
    ],
    "ans": 1,
    "info": "«Plaza Guridi» está en Zurbaran, distrito Uribarri.",
    "tipo": "espacioDistrito",
    "fuente": "https://ca.wikipedia.org/wiki/Zurbaran",
    "fuenteTitulo": "Wikipedia (ca): Zurbaran"
   }
  ]
 },
 {
  "nombre": "Arabella",
  "distrito": "Uribarri",
  "lema": "Viento fresco de las alturas",
  "pintxo": {
   "nombre": "Pintxo de txistorra de Arabella",
   "ingrediente": "txistorra",
   "color": "#a5d8ff",
   "forma": 0
  },
  "fuentes": [
   "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.deia.eus/bilbao/2026/05/10/arabella-barrio-construido-grupos-viviendas-bilbao-11044906.html"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Arabella?",
    "opts": [
     "Uribarri",
     "Deustu",
     "Begoña",
     "Errekalde"
    ],
    "ans": 0,
    "info": "Arabella forma parte del distrito Uribarri.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Arabella en el padrón de 2023?",
    "opts": [
     "4642",
     "3257",
     "2469",
     "1685"
    ],
    "ans": 3,
    "info": "El padrón municipal de 2023 registraba 1685 habitantes en Arabella.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Arabella?",
    "opts": [
     "Metro · Bolueta (L1/L2)",
     "Solo autobús",
     "Metro · Indautxu (L1/L2)",
     "Metro · Santutxu (L1/L2)"
    ],
    "ans": 1,
    "info": "Arabella: Solo autobús. Solo autobús; parte alta de Zabalbide",
    "tipo": "access",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Arabella?",
    "opts": [
     "Estación de metro Uribarri (L3)",
     "Grupo Cooperativo Arabella, levantado con la Ley de Casas Baratas de 1924",
     "Estación de Abando Indalecio Prieto",
     "Universidad de Deusto"
    ],
    "ans": 1,
    "info": "«Grupo Cooperativo Arabella, levantado con la Ley de Casas Baratas de 1924» es un hito de Arabella.",
    "tipo": "hitoId",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Grupo Cooperativo Arabella, levantado con la Ley de Casas Baratas de 1924»?",
    "opts": [
     "Iturrigorri - Peñascal",
     "Arabella",
     "Otxarkoaga",
     "Iturralde"
    ],
    "ans": 1,
    "info": "«Grupo Cooperativo Arabella, levantado con la Ley de Casas Baratas de 1924» está en Arabella.",
    "tipo": "hitoRev",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Arabella?",
    "opts": [
     "Plaza Saralegi",
     "Plaza Circular / Plaza Biribila",
     "Plaza principal del Grupo Arabella",
     "Entorno del monte Kobetas y Camino Kobetas"
    ],
    "ans": 2,
    "info": "«Plaza principal del Grupo Arabella» está en Arabella.",
    "tipo": "espacioId",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza principal del Grupo Arabella»?",
    "opts": [
     "Artxanda",
     "Monte Caramelo",
     "Matiko",
     "Arabella"
    ],
    "ans": 3,
    "info": "«Plaza principal del Grupo Arabella» pertenece a Arabella.",
    "tipo": "espacioRev",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Calle Zabalbide, la más larga y alta de Bilbao»?",
    "opts": [
     "Otxarkoaga",
     "Ribera de Deusto",
     "Arabella",
     "Matiko"
    ],
    "ans": 2,
    "info": "«Calle Zabalbide, la más larga y alta de Bilbao» está en Arabella.",
    "tipo": "hitoRev",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Calles particulares ajardinadas de la cooperativa»?",
    "opts": [
     "San Ignacio",
     "Mina del Morro",
     "Arabella",
     "Casco Viejo"
    ],
    "ans": 2,
    "info": "«Calles particulares ajardinadas de la cooperativa» pertenece a Arabella.",
    "tipo": "espacioRev",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Arabella?",
    "opts": [
     "Iturralde",
     "Kastrexana",
     "Uribarri",
     "Albia"
    ],
    "ans": 2,
    "info": "Arabella y Uribarri están en el distrito Uribarri.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Uribarri?",
    "opts": [
     "Gurtubay",
     "San Francisco",
     "Arabella",
     "Basurto"
    ],
    "ans": 2,
    "info": "Arabella está en el distrito Uribarri.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Arabella estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Arabella no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Arabella",
     "Abando",
     "Santutxu"
    ],
    "ans": 3,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Alto de Santo Domingo, mirador y paso del Camino de Santiago»?",
    "opts": [
     "Zorrotzaurre",
     "Matiko",
     "Olabeaga",
     "Arabella"
    ],
    "ans": 3,
    "info": "«Alto de Santo Domingo, mirador y paso del Camino de Santiago» está en Arabella.",
    "tipo": "hitoRev",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Grupo Cooperativo Arabella, levantado con la Ley de Casas Baratas de 1924»?",
    "opts": [
     "Begoña",
     "Ibaiondo",
     "Errekalde",
     "Uribarri"
    ],
    "ans": 3,
    "info": "«Grupo Cooperativo Arabella, levantado con la Ley de Casas Baratas de 1924» está en Arabella, distrito Uribarri.",
    "tipo": "hitoDistrito",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza principal del Grupo Arabella»?",
    "opts": [
     "Basurtu-Zorrotza",
     "Deustu",
     "Abando",
     "Uribarri"
    ],
    "ans": 3,
    "info": "«Plaza principal del Grupo Arabella» está en Arabella, distrito Uribarri.",
    "tipo": "espacioDistrito",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Uribarri?",
    "opts": [
     "Ciudad Jardín",
     "San Pedro de Deusto",
     "Zurbaran",
     "Castaños"
    ],
    "ans": 1,
    "info": "San Pedro de Deusto no está en Uribarri.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Grupo Cooperativo Arabella, levantado con la Ley de Casas Baratas de 1924» está en Arabella?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Arabella.",
    "tipo": "tfHitoYes",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Arabella?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese hito no está en Arabella.",
    "tipo": "tfHitoNo",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   },
   {
    "q": "¿El espacio «Plaza principal del Grupo Arabella» está en Arabella?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Arabella.",
    "tipo": "tfEspacioYes",
    "fuente": "http://www.tik-ra.org/assets/Arabella_Ficha_Cast_web.pdf",
    "fuenteTitulo": "tik-ra.org (PDF)"
   }
  ]
 },
 {
  "nombre": "Artxanda",
  "distrito": "Uribarri",
  "lema": "El mirador que guarda el reino",
  "pintxo": {
   "nombre": "Pintxo de txuleta de Artxanda",
   "ingrediente": "txuleta",
   "color": "#e7c15a",
   "forma": 1
  },
  "fuentes": [
   "https://www.visitbiscay.eus/es/funicular-de-artxanda",
   "https://es.wikipedia.org/wiki/Artxanda",
   "https://www.bilbaoturismo.net/BilbaoTurismo/es/funicular",
   "https://turismo.euskadi.eus/es/etapas/monte-artxanda/webtur00-content/es",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Artxanda?",
    "opts": [
     "Uribarri",
     "Ibaiondo",
     "Begoña",
     "Basurtu-Zorrotza"
    ],
    "ans": 0,
    "info": "Artxanda forma parte del distrito Uribarri.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Artxanda?",
    "opts": [
     "Metro · Matiko (L3)",
     "Tranvía · T1 Atxuri",
     "Metro · Indautxu (L1/L2)",
     "Funicular de Artxanda y autobús"
    ],
    "ans": 3,
    "info": "Artxanda: Funicular de Artxanda y autobús. Funicular de Artxanda (1915) y autobús",
    "tipo": "access",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Artxanda?",
    "opts": [
     "Puente de Deusto (levadizo)",
     "Funicular de Artxanda, inaugurado en 1915",
     "Monte Artxanda",
     "Galería y horno de calcinación de la mina San Luis"
    ],
    "ans": 1,
    "info": "«Funicular de Artxanda, inaugurado en 1915» es un hito de Artxanda.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Funicular de Artxanda, inaugurado en 1915»?",
    "opts": [
     "Artxanda",
     "Indautxu",
     "Casco Viejo",
     "Matiko"
    ],
    "ans": 0,
    "info": "«Funicular de Artxanda, inaugurado en 1915» está en Artxanda.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Artxanda?",
    "opts": [
     "Punta de Zorrotzaurre",
     "Plaza de Santiago y plaza de San Nicolás",
     "Plaza principal del barrio",
     "Mirador de Artxanda"
    ],
    "ans": 3,
    "info": "«Mirador de Artxanda» está en Artxanda.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Mirador de Artxanda»?",
    "opts": [
     "Zurbaran",
     "Artxanda",
     "Abando",
     "San Ignacio"
    ],
    "ans": 1,
    "info": "«Mirador de Artxanda» pertenece a Artxanda.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Mirador con vistas panorámicas sobre Bilbao»?",
    "opts": [
     "Basurto",
     "Artxanda",
     "Arangoiti",
     "Errekaldeberri"
    ],
    "ans": 1,
    "info": "«Mirador con vistas panorámicas sobre Bilbao» está en Artxanda.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Pikotamendi»?",
    "opts": [
     "Guggenheim - Ensanche",
     "Masustegi",
     "Artxanda",
     "Arabella"
    ],
    "ans": 2,
    "info": "«Parque de Pikotamendi» pertenece a Artxanda.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Artxanda?",
    "opts": [
     "Begoña",
     "Uribarri",
     "Atxuri",
     "La Peña"
    ],
    "ans": 1,
    "info": "Artxanda y Uribarri están en el distrito Uribarri.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Uribarri?",
    "opts": [
     "San Adrián",
     "Arangoiti",
     "Artxanda",
     "Miribilla"
    ],
    "ans": 2,
    "info": "Artxanda está en el distrito Uribarri.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Artxanda estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Artxanda no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Cumbre de 251 metros»?",
    "opts": [
     "Artxanda",
     "Abando",
     "Guggenheim - Ensanche",
     "Ametzola"
    ],
    "ans": 0,
    "info": "«Cumbre de 251 metros» está en Artxanda.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Merenderos de la cumbre»?",
    "opts": [
     "Betolaza",
     "Artxanda",
     "Atxuri",
     "Campuzano"
    ],
    "ans": 1,
    "info": "«Merenderos de la cumbre» pertenece a Artxanda.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Funicular de Artxanda, inaugurado en 1915»?",
    "opts": [
     "Uribarri",
     "Errekalde",
     "Otxarkoaga-Txurdinaga",
     "Basurtu-Zorrotza"
    ],
    "ans": 0,
    "info": "«Funicular de Artxanda, inaugurado en 1915» está en Artxanda, distrito Uribarri.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿En qué distrito se encuentra «Mirador de Artxanda»?",
    "opts": [
     "Uribarri",
     "Abando",
     "Deustu",
     "Ibaiondo"
    ],
    "ans": 0,
    "info": "«Mirador de Artxanda» está en Artxanda, distrito Uribarri.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Uribarri?",
    "opts": [
     "Matiko",
     "San Pedro de Deusto",
     "Zurbaran",
     "Castaños"
    ],
    "ans": 1,
    "info": "San Pedro de Deusto no está en Uribarri.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_2.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Funicular de Artxanda, inaugurado en 1915» está en Artxanda?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Artxanda.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Artxanda?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese hito no está en Artxanda.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿El espacio «Mirador de Artxanda» está en Artxanda?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Artxanda.",
    "tipo": "tfEspacioYes",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   },
   {
    "q": "¿El espacio «Plaza de San Pedro» está en Artxanda?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese espacio no está en Artxanda.",
    "tipo": "tfEspacioNo",
    "fuente": "https://es.wikipedia.org/wiki/Artxanda",
    "fuenteTitulo": "Wikipedia: Artxanda"
   }
  ]
 },
 {
  "nombre": "Otxarkoaga",
  "distrito": "Otxarkoaga-Txurdinaga",
  "lema": "Pueblo forjado en mil colinas",
  "pintxo": {
   "nombre": "Pintxo de bonito de Otxarkoaga",
   "ingrediente": "bonito",
   "color": "#e08a4a",
   "forma": 2
  },
  "fuentes": [
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://es.wikipedia.org/wiki/Ocharcoaga",
   "https://euskotren.eus/sites/default/files/2024-12/L3.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
   "https://www.otxarkoaga.com/historia/"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Otxarkoaga?",
    "opts": [
     "Uribarri",
     "Basurtu-Zorrotza",
     "Otxarkoaga-Txurdinaga",
     "Abando"
    ],
    "ans": 2,
    "info": "Otxarkoaga forma parte del distrito Otxarkoaga-Txurdinaga.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Otxarkoaga en el padrón de 2023?",
    "opts": [
     "12.135",
     "10.194",
     "590",
     "452"
    ],
    "ans": 1,
    "info": "El padrón municipal de 2023 registraba 10.194 habitantes en Otxarkoaga.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Otxarkoaga?",
    "opts": [
     "60,1 ha",
     "55 ha",
     "47 ha",
     "129 ha"
    ],
    "ans": 1,
    "info": "Otxarkoaga ocupa aproximadamente 55 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Otxarkoaga?",
    "opts": [
     "185,3 hab/ha",
     "218,2 hab/ha",
     "120,8 hab/ha",
     "187 hab/ha"
    ],
    "ans": 0,
    "info": "La densidad de Otxarkoaga ronda los 185,3 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Otxarkoaga?",
    "opts": [
     "Otxarkoaga (L3)",
     "Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Santutxu (L1/L2)",
     "Indautxu (L1/L2)"
    ],
    "ans": 0,
    "info": "La estación de metro más próxima es Otxarkoaga (L3).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Otxarkoaga?",
    "opts": [
     "Tren · Renfe Cercanías Olabeaga",
     "Tren · Renfe Cercanías Zorrotza (C-1/C-2/C-4)",
     "Metro · Sarriko (L1/L2)",
     "Metro · Otxarkoaga (L3)"
    ],
    "ans": 3,
    "info": "Otxarkoaga: Metro · Otxarkoaga (L3). Estación Otxarkoaga (salidas Lozoño y Kepa Enbeita)",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Otxarkoaga?",
    "opts": [
     "Monumento a Marx y Lenin en la plaza Kepa Enbeita, inaugurado en 1993 ('Lenin Eguna')",
     "Plan urbanístico de Zaha Hadid para la isla",
     "Reforma de la plaza en 2006",
     "Monte Artxanda"
    ],
    "ans": 0,
    "info": "«Monumento a Marx y Lenin en la plaza Kepa Enbeita, inaugurado en 1993 ('Lenin Eguna')» es un hito de Otxarkoaga.",
    "tipo": "hitoId",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Monumento a Marx y Lenin en la plaza Kepa Enbeita, inaugurado en 1993 ('Lenin Eguna')»?",
    "opts": [
     "Otxarkoaga",
     "Mina del Morro",
     "Betolaza",
     "Basurto"
    ],
    "ans": 0,
    "info": "«Monumento a Marx y Lenin en la plaza Kepa Enbeita, inaugurado en 1993 ('Lenin Eguna')» está en Otxarkoaga.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Otxarkoaga?",
    "opts": [
     "Plaza Iturriondo",
     "Parque de Doña Casilda Iturrizar",
     "Plaza de Los Botijos",
     "Plaza Kepa Enbeita 'Urretxindorra' (La Parada)"
    ],
    "ans": 3,
    "info": "«Plaza Kepa Enbeita 'Urretxindorra' (La Parada)» está en Otxarkoaga.",
    "tipo": "espacioId",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Kepa Enbeita 'Urretxindorra' (La Parada)»?",
    "opts": [
     "Txurdinaga",
     "Bilbao La Vieja",
     "Otxarkoaga",
     "Casco Viejo"
    ],
    "ans": 2,
    "info": "«Plaza Kepa Enbeita 'Urretxindorra' (La Parada)» pertenece a Otxarkoaga.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Poblado Dirigido de Otxarkoaga, construido en los años 60 para erradicar el chabolismo»?",
    "opts": [
     "Uribarri",
     "San Pedro de Deusto",
     "Artxanda",
     "Otxarkoaga"
    ],
    "ans": 3,
    "info": "«Poblado Dirigido de Otxarkoaga, construido en los años 60 para erradicar el chabolismo» está en Otxarkoaga.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Ugarte»?",
    "opts": [
     "Masustegi",
     "San Adrián",
     "Otxarkoaga",
     "Atxuri"
    ],
    "ans": 2,
    "info": "«Plaza Ugarte» pertenece a Otxarkoaga.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Otxarkoaga?",
    "opts": [
     "Zurbaran",
     "Olabeaga",
     "Txurdinaga",
     "Uribarri"
    ],
    "ans": 2,
    "info": "Otxarkoaga y Txurdinaga están en el distrito Otxarkoaga-Txurdinaga.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Otxarkoaga-Txurdinaga?",
    "opts": [
     "Betolaza",
     "Otxarkoaga",
     "Gurtubay",
     "San Pedro de Deusto"
    ],
    "ans": 1,
    "info": "Otxarkoaga está en el distrito Otxarkoaga-Txurdinaga.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Otxarkoaga estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Otxarkoaga (L3).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Otxarkoaga (L3) da servicio a Otxarkoaga?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Otxarkoaga (L3) es la estación de metro de Otxarkoaga.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Otxarkoaga?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Otxarkoaga.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Indautxu",
     "Abando",
     "Otxarkoaga"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Mercado municipal de Otxarkoaga»?",
    "opts": [
     "Casco Viejo",
     "Miribilla",
     "Otxarkoaga",
     "Monte Caramelo"
    ],
    "ans": 2,
    "info": "«Mercado municipal de Otxarkoaga» está en Otxarkoaga.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Ángela Arregi, sobre el mercado»?",
    "opts": [
     "Otxarkoaga",
     "Txurdinaga",
     "San Pedro de Deusto",
     "Campuzano"
    ],
    "ans": 0,
    "info": "«Plaza Ángela Arregi, sobre el mercado» pertenece a Otxarkoaga.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   }
  ]
 },
 {
  "nombre": "Txurdinaga",
  "distrito": "Otxarkoaga-Txurdinaga",
  "lema": "Parques abiertos donde corre la brisa",
  "pintxo": {
   "nombre": "Pintxo de bacalao de Txurdinaga",
   "ingrediente": "bacalao",
   "color": "#f0d27a",
   "forma": 3
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://es.wikipedia.org/wiki/Churd%C3%ADnaga",
   "https://euskotren.eus/sites/default/files/2024-12/L3.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.bilbaopedia.info/otxarkoaga-txurdinaga"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Txurdinaga?",
    "opts": [
     "Errekalde",
     "Otxarkoaga-Txurdinaga",
     "Begoña",
     "Ibaiondo"
    ],
    "ans": 1,
    "info": "Txurdinaga forma parte del distrito Otxarkoaga-Txurdinaga.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Txurdinaga en el padrón de 2023?",
    "opts": [
     "14.851",
     "5571",
     "4642",
     "7331"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 14.851 habitantes en Txurdinaga.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Txurdinaga?",
    "opts": [
     "110 ha",
     "20 ha",
     "51 ha",
     "17 ha"
    ],
    "ans": 0,
    "info": "Txurdinaga ocupa aproximadamente 110 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Txurdinaga?",
    "opts": [
     "263 hab/ha",
     "463,9 hab/ha",
     "135 hab/ha",
     "123,5 hab/ha"
    ],
    "ans": 2,
    "info": "La densidad de Txurdinaga ronda los 135 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Txurdinaga?",
    "opts": [
     "Otxarkoaga (L3)",
     "Txurdinaga (L3)",
     "Sarriko (L1/L2)",
     "Matiko (L3)"
    ],
    "ans": 1,
    "info": "La estación de metro más próxima es Txurdinaga (L3).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Txurdinaga?",
    "opts": [
     "Metro · Santimami/San Mamés (L1/L2)",
     "Metro · Matiko (L3)",
     "Metro (Moyua y Abando)",
     "Metro · Txurdinaga (L3)"
    ],
    "ans": 3,
    "info": "Txurdinaga: Metro · Txurdinaga (L3). Estación Txurdinaga (salida Gabriel Aresti)",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Txurdinaga?",
    "opts": [
     "Sociedad Deportiva Indautxu (1924)",
     "Túneles de Begoña",
     "Monumento a Castelao en el Parque de Europa, de M. Ángel Lerxundi",
     "Iglesias de San Antón, San Nicolás y Santos Juanes"
    ],
    "ans": 2,
    "info": "«Monumento a Castelao en el Parque de Europa, de M. Ángel Lerxundi» es un hito de Txurdinaga.",
    "tipo": "hitoId",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Monumento a Castelao en el Parque de Europa, de M. Ángel Lerxundi»?",
    "opts": [
     "Miribilla",
     "Larraskitu",
     "Txurdinaga",
     "Uribarri"
    ],
    "ans": 2,
    "info": "«Monumento a Castelao en el Parque de Europa, de M. Ángel Lerxundi» está en Txurdinaga.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Txurdinaga?",
    "opts": [
     "Plaza Tres Pilares",
     "Parque de Europa (107.000 m², 1988)",
     "Mirador de Artxanda",
     "Plaza de las Mujeres 25 de Noviembre"
    ],
    "ans": 1,
    "info": "«Parque de Europa (107.000 m², 1988)» está en Txurdinaga.",
    "tipo": "espacioId",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Europa (107.000 m², 1988)»?",
    "opts": [
     "Txurdinaga",
     "Zorrotzaurre",
     "Abando",
     "Castaños"
    ],
    "ans": 0,
    "info": "«Parque de Europa (107.000 m², 1988)» pertenece a Txurdinaga.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Escultura 'Minotauro' en el Parque de Europa»?",
    "opts": [
     "Ciudad Jardín",
     "Txurdinaga",
     "Ibarrekolanda",
     "Santutxu"
    ],
    "ans": 1,
    "info": "«Escultura 'Minotauro' en el Parque de Europa» está en Txurdinaga.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Jardines de Garai»?",
    "opts": [
     "San Ignacio",
     "Ibarrekolanda",
     "Iralabarri",
     "Txurdinaga"
    ],
    "ans": 3,
    "info": "«Jardines de Garai» pertenece a Txurdinaga.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Txurdinaga?",
    "opts": [
     "Otxarkoaga",
     "Masustegi",
     "Abando",
     "Monte Caramelo"
    ],
    "ans": 0,
    "info": "Txurdinaga y Otxarkoaga están en el distrito Otxarkoaga-Txurdinaga.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Otxarkoaga-Txurdinaga?",
    "opts": [
     "Bolueta",
     "Txurdinaga",
     "Abando",
     "Kastrexana"
    ],
    "ans": 1,
    "info": "Txurdinaga está en el distrito Otxarkoaga-Txurdinaga.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_3.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Txurdinaga estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Txurdinaga (L3).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Txurdinaga (L3) da servicio a Txurdinaga?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Txurdinaga (L3) es la estación de metro de Txurdinaga.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Txurdinaga?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, Deustu (L1/L2) no es la estación de Txurdinaga.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Txurdinaga",
     "Santutxu",
     "Abando"
    ],
    "ans": 2,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Instituto Gabriel Aresti»?",
    "opts": [
     "Txurdinaga",
     "Zurbaran",
     "Miribilla",
     "Guggenheim - Ensanche"
    ],
    "ans": 0,
    "info": "«Instituto Gabriel Aresti» está en Txurdinaga.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Jardines de Mrs. Leah Manning»?",
    "opts": [
     "Iturralde",
     "Santutxu",
     "Txurdinaga",
     "Errekaldeberri"
    ],
    "ans": 2,
    "info": "«Jardines de Mrs. Leah Manning» pertenece a Txurdinaga.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/otxarkoaga-txurdinaga",
    "fuenteTitulo": "bilbaopedia.info"
   }
  ]
 },
 {
  "nombre": "Begoña",
  "distrito": "Begoña",
  "lema": "Campanas y devoción sobre la villa",
  "pintxo": {
   "nombre": "Pintxo de croqueta de Begoña",
   "ingrediente": "croqueta",
   "color": "#f0d27a",
   "forma": 4
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.bilbaoturismo.net/BilbaoTurismo/es/que-ver/basilica-de-begona",
   "https://www.ondavasca.com/begona-el-bilbao-mas-primigenio/"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Begoña?",
    "opts": [
     "Deustu",
     "Ibaiondo",
     "Begoña",
     "Abando"
    ],
    "ans": 2,
    "info": "Begoña forma parte del distrito Begoña.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Begoña en el padrón de 2023?",
    "opts": [
     "1679",
     "4642",
     "452",
     "10.999"
    ],
    "ans": 1,
    "info": "El padrón municipal de 2023 registraba 4642 habitantes en Begoña.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Begoña?",
    "opts": [
     "20 ha",
     "38 ha",
     "79 ha",
     "41 ha"
    ],
    "ans": 0,
    "info": "Begoña ocupa aproximadamente 20 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Begoña?",
    "opts": [
     "232,1 hab/ha",
     "406,6 hab/ha",
     "403 hab/ha",
     "447,7 hab/ha"
    ],
    "ans": 0,
    "info": "La densidad de Begoña ronda los 232,1 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Begoña?",
    "opts": [
     "Metro · Santutxu (L1/L2)",
     "Solo autobús",
     "Metro · Abando (L1/L2)",
     "Metro (Indautxu)"
    ],
    "ans": 1,
    "info": "Begoña: Solo autobús. Solo autobús; próximas: Santutxu (L1/L2) y salida Mallona de Zazpikaleak/Casco Viejo",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Begoña?",
    "opts": [
     "Basílica de Begoña, santuario de la 'Amatxu', patrona de Bizkaia",
     "Escultura La Huella y txakolís de la cumbre",
     "Antiguo hospital de Solokoetxe (1891-1892, Edesio Garamendi), hoy instituto",
     "Universidad de Deusto"
    ],
    "ans": 0,
    "info": "«Basílica de Begoña, santuario de la 'Amatxu', patrona de Bizkaia» es un hito de Begoña.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Basílica de Begoña, santuario de la 'Amatxu', patrona de Bizkaia»?",
    "opts": [
     "Matiko",
     "Ribera de Deusto",
     "Zorrotzaurre",
     "Begoña"
    ],
    "ans": 3,
    "info": "«Basílica de Begoña, santuario de la 'Amatxu', patrona de Bizkaia» está en Begoña.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Begoña?",
    "opts": [
     "Plaza de Garellano",
     "Plaza de Zabálburu",
     "Espacios verdes y plazas interiores del polígono",
     "Plaza Juan XXIII, tras la basílica"
    ],
    "ans": 3,
    "info": "«Plaza Juan XXIII, tras la basílica» está en Begoña.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Juan XXIII, tras la basílica»?",
    "opts": [
     "San Mamés",
     "Gurtubay",
     "Matiko",
     "Begoña"
    ],
    "ans": 3,
    "info": "«Plaza Juan XXIII, tras la basílica» pertenece a Begoña.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Viacrucis y Calzadas de Mallona de subida a la basílica»?",
    "opts": [
     "Arangoiti",
     "Iralabarri",
     "San Francisco",
     "Begoña"
    ],
    "ans": 3,
    "info": "«Viacrucis y Calzadas de Mallona de subida a la basílica» está en Begoña.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Miguel de Unamuno y Calzadas de Mallona»?",
    "opts": [
     "Betolaza",
     "Larraskitu",
     "Begoña",
     "Campuzano"
    ],
    "ans": 2,
    "info": "«Plaza Miguel de Unamuno y Calzadas de Mallona» pertenece a Begoña.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Begoña?",
    "opts": [
     "Santutxu",
     "Casco Viejo",
     "Ibarrekolanda",
     "Atxuri"
    ],
    "ans": 0,
    "info": "Begoña y Santutxu están en el distrito Begoña.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Begoña?",
    "opts": [
     "Betolaza",
     "Begoña",
     "Matiko",
     "Kastrexana"
    ],
    "ans": 1,
    "info": "Begoña está en el distrito Begoña.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Begoña estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Begoña no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Abando",
     "Indautxu",
     "Santutxu",
     "Begoña"
    ],
    "ans": 2,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Solar del antiguo ayuntamiento de la anteiglesia de Begoña ('casa de la República')»?",
    "opts": [
     "Artxanda",
     "Uretamendi",
     "Zabala",
     "Begoña"
    ],
    "ans": 3,
    "info": "«Solar del antiguo ayuntamiento de la anteiglesia de Begoña ('casa de la República')» está en Begoña.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Makua»?",
    "opts": [
     "Begoña",
     "Betolaza",
     "Zurbaran",
     "Monte Caramelo"
    ],
    "ans": 0,
    "info": "«Plaza Makua» pertenece a Begoña.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Basílica de Begoña, santuario de la 'Amatxu', patrona de Bizkaia»?",
    "opts": [
     "Begoña",
     "Uribarri",
     "Ibaiondo",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 0,
    "info": "«Basílica de Begoña, santuario de la 'Amatxu', patrona de Bizkaia» está en Begoña, distrito Begoña.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza Juan XXIII, tras la basílica»?",
    "opts": [
     "Abando",
     "Begoña",
     "Deustu",
     "Errekalde"
    ],
    "ans": 1,
    "info": "«Plaza Juan XXIII, tras la basílica» está en Begoña, distrito Begoña.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Barrio_de_Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Barrio de Begoña"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Abando",
     "Txurdinaga",
     "Zorrotza",
     "Begoña"
    ],
    "ans": 2,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Santutxu",
  "distrito": "Begoña",
  "lema": "El laberinto más vivo del pueblo",
  "pintxo": {
   "nombre": "Pintxo de gilda de Santutxu",
   "ingrediente": "gilda",
   "color": "#ffd166",
   "forma": 5
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://es.wikipedia.org/wiki/Santutxu",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.ondavasca.com/begona-el-bilbao-mas-primigenio/"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Santutxu?",
    "opts": [
     "Abando",
     "Otxarkoaga-Txurdinaga",
     "Begoña",
     "Uribarri"
    ],
    "ans": 2,
    "info": "Santutxu forma parte del distrito Begoña.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Santutxu en el padrón de 2023?",
    "opts": [
     "19.961",
     "10.520",
     "30.836",
     "27.039"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 30.836 habitantes en Santutxu.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Santutxu?",
    "opts": [
     "51 ha",
     "81 ha",
     "38 ha",
     "117 ha"
    ],
    "ans": 1,
    "info": "Santutxu ocupa aproximadamente 81 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Santutxu?",
    "opts": [
     "463,9 hab/ha",
     "380,7 hab/ha",
     "71,3 hab/ha",
     "315,3 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Santutxu ronda los 380,7 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Santutxu?",
    "opts": [
     "Otxarkoaga (L3)",
     "Santutxu (L1/L2)",
     "Matiko (L3)",
     "Abando (L1/L2)"
    ],
    "ans": 1,
    "info": "La estación de metro más próxima es Santutxu (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Santutxu?",
    "opts": [
     "Metro · Zurbaranbarri (L3)",
     "Metro · Santutxu (L1/L2)",
     "Tren · Renfe Cercanías Olabeaga",
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)"
    ],
    "ans": 1,
    "info": "Santutxu: Metro · Santutxu (L1/L2). Santutxu (salidas Karmelo y Zabalbide) y Basarrate",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Santutxu?",
    "opts": [
     "Antiguos cuarteles de Garellano",
     "Ermita de San Francisco de Paula, 'San Francisquito' (1737), origen del nombre del barrio",
     "Calle Zabalbide, la más larga y alta de Bilbao",
     "Antiguo estadio de San Mamés (1913-2013)"
    ],
    "ans": 1,
    "info": "«Ermita de San Francisco de Paula, 'San Francisquito' (1737), origen del nombre del barrio» es un hito de Santutxu.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Santutxu",
    "fuenteTitulo": "Wikipedia: Santutxu"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Ermita de San Francisco de Paula, 'San Francisquito' (1737), origen del nombre del barrio»?",
    "opts": [
     "Santutxu",
     "San Francisco",
     "La Peña",
     "Errekaldeberri"
    ],
    "ans": 0,
    "info": "«Ermita de San Francisco de Paula, 'San Francisquito' (1737), origen del nombre del barrio» está en Santutxu.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Santutxu",
    "fuenteTitulo": "Wikipedia: Santutxu"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Santutxu?",
    "opts": [
     "Parque Etxebarria (170.000 m², el mayor parque urbano de Bilbao)",
     "Espacios verdes y plazas interiores del polígono",
     "Bilbao Intermodal",
     "Parque 'El corral de la Pacheca'"
    ],
    "ans": 0,
    "info": "«Parque Etxebarria (170.000 m², el mayor parque urbano de Bilbao)» está en Santutxu.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Santutxu",
    "fuenteTitulo": "Wikipedia: Santutxu"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque Etxebarria (170.000 m², el mayor parque urbano de Bilbao)»?",
    "opts": [
     "Zorrotza",
     "Iturralde",
     "Santutxu",
     "San Pedro de Deusto"
    ],
    "ans": 2,
    "info": "«Parque Etxebarria (170.000 m², el mayor parque urbano de Bilbao)» pertenece a Santutxu.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Santutxu",
    "fuenteTitulo": "Wikipedia: Santutxu"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Chimenea conservada de la antigua fundición Aceros Etxebarría (1943, 25 m)»?",
    "opts": [
     "Basurto",
     "Elorrieta",
     "Zurbaran",
     "Santutxu"
    ],
    "ans": 3,
    "info": "«Chimenea conservada de la antigua fundición Aceros Etxebarría (1943, 25 m)» está en Santutxu.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Santutxu",
    "fuenteTitulo": "Wikipedia: Santutxu"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque Europa»?",
    "opts": [
     "Santutxu",
     "La Peña",
     "Uretamendi",
     "Zabala"
    ],
    "ans": 0,
    "info": "«Parque Europa» pertenece a Santutxu.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Santutxu",
    "fuenteTitulo": "Wikipedia: Santutxu"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Santutxu?",
    "opts": [
     "Altamira",
     "Larraskitu",
     "La Peña",
     "Begoña"
    ],
    "ans": 3,
    "info": "Santutxu y Begoña están en el distrito Begoña.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Begoña?",
    "opts": [
     "Solokoetxe",
     "Zurbaran",
     "Santutxu",
     "Castaños"
    ],
    "ans": 2,
    "info": "Santutxu está en el distrito Begoña.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Santutxu estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Santutxu (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Santutxu (L1/L2) da servicio a Santutxu?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, Santutxu (L1/L2) es la estación de metro de Santutxu.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Santutxu?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Santutxu.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "San Pedro de Deusto",
     "Abando",
     "Indautxu",
     "Santutxu"
    ],
    "ans": 3,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Campa de Basarrate como plaza mayor del barrio»?",
    "opts": [
     "Masustegi",
     "San Francisco",
     "Solokoetxe",
     "Santutxu"
    ],
    "ans": 3,
    "info": "«Campa de Basarrate como plaza mayor del barrio» está en Santutxu.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Santutxu",
    "fuenteTitulo": "Wikipedia: Santutxu"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Campa de Basarrate, 'Campa del Muerto'»?",
    "opts": [
     "Miribilla",
     "Ibarrekolanda",
     "Santutxu",
     "Zabala"
    ],
    "ans": 2,
    "info": "«Campa de Basarrate, 'Campa del Muerto'» pertenece a Santutxu.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Santutxu",
    "fuenteTitulo": "Wikipedia: Santutxu"
   }
  ]
 },
 {
  "nombre": "Bolueta",
  "distrito": "Begoña",
  "lema": "Chimeneas antiguas junto al cauce",
  "pintxo": {
   "nombre": "Pintxo de sardina de Bolueta",
   "ingrediente": "sardina",
   "color": "#e08a4a",
   "forma": 0
  },
  "fuentes": [
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://es.wikipedia.org/wiki/Bolueta",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.euskotren.eus/sites/default/files/horarios/tranvia%20bilbao_horizontal-A3-%20Verano%202025_0.pdf"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Bolueta?",
    "opts": [
     "Abando",
     "Otxarkoaga-Txurdinaga",
     "Begoña",
     "Deustu"
    ],
    "ans": 2,
    "info": "Bolueta forma parte del distrito Begoña.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Bolueta en el padrón de 2023?",
    "opts": [
     "3999",
     "590",
     "5491",
     "19.961"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 5491 habitantes en Bolueta.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Bolueta?",
    "opts": [
     "25 ha",
     "39 ha",
     "13 ha",
     "77 ha"
    ],
    "ans": 3,
    "info": "Bolueta ocupa aproximadamente 77 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Bolueta?",
    "opts": [
     "406,6 hab/ha",
     "238 hab/ha",
     "71,3 hab/ha",
     "206,3 hab/ha"
    ],
    "ans": 2,
    "info": "La densidad de Bolueta ronda los 71,3 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Bolueta?",
    "opts": [
     "Bolueta (L1/L2)",
     "Moyua (L1/L2)",
     "Otxarkoaga (L3)",
     "Basarrate (L1/L2)"
    ],
    "ans": 0,
    "info": "La estación de metro más próxima es Bolueta (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Bolueta?",
    "opts": [
     "Metro · Bolueta (L1/L2)",
     "Metro · Deustu (L1/L2)",
     "Metro (Moyua y Abando)",
     "Metro (Abando y Moyua)"
    ],
    "ans": 0,
    "info": "Bolueta: Metro · Bolueta (L1/L2). Metro Bolueta y parada final del tranvía T1 (desde 2022)",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Bolueta?",
    "opts": [
     "Antiguo hospital de Solokoetxe (1891-1892, Edesio Garamendi), hoy instituto",
     "Santa Ana de Bolueta, primera planta moderna de transformación de acero de Bizkaia (1840)",
     "Acceso al monte Pagasarri",
     "Jardines Emiliano Arriaga como espacio deportivo de referencia"
    ],
    "ans": 1,
    "info": "«Santa Ana de Bolueta, primera planta moderna de transformación de acero de Bizkaia (1840)» es un hito de Bolueta.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Bolueta",
    "fuenteTitulo": "Wikipedia: Bolueta"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Santa Ana de Bolueta, primera planta moderna de transformación de acero de Bizkaia (1840)»?",
    "opts": [
     "Monte Caramelo",
     "San Mamés",
     "Bolueta",
     "Indautxu"
    ],
    "ans": 2,
    "info": "«Santa Ana de Bolueta, primera planta moderna de transformación de acero de Bizkaia (1840)» está en Bolueta.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bolueta",
    "fuenteTitulo": "Wikipedia: Bolueta"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Bolueta?",
    "opts": [
     "Plaza de la Merced",
     "Plaza de Ibarrekolanda",
     "Parque de Etxebarria (170.000 m², linde con Santutxu)",
     "Entorno fluvial y zonas de paseo junto al Nervión y al parque de la ría"
    ],
    "ans": 3,
    "info": "«Entorno fluvial y zonas de paseo junto al Nervión y al parque de la ría» está en Bolueta.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Bolueta",
    "fuenteTitulo": "Wikipedia: Bolueta"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Entorno fluvial y zonas de paseo junto al Nervión y al parque de la ría»?",
    "opts": [
     "Begoña",
     "Bolueta",
     "Ibarrekolanda",
     "Zorrotza"
    ],
    "ans": 1,
    "info": "«Entorno fluvial y zonas de paseo junto al Nervión y al parque de la ría» pertenece a Bolueta.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Bolueta",
    "fuenteTitulo": "Wikipedia: Bolueta"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de metro Bolueta (1997)»?",
    "opts": [
     "Zurbaran",
     "San Francisco",
     "Altamira",
     "Bolueta"
    ],
    "ans": 3,
    "info": "«Estación de metro Bolueta (1997)» está en Bolueta.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bolueta",
    "fuenteTitulo": "Wikipedia: Bolueta"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Bolueta?",
    "opts": [
     "Ciudad Jardín",
     "Ribera de Deusto",
     "Zorrotza",
     "Begoña"
    ],
    "ans": 3,
    "info": "Bolueta y Begoña están en el distrito Begoña.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Begoña?",
    "opts": [
     "Zurbaran",
     "Bolueta",
     "Ribera de Deusto",
     "Elorrieta"
    ],
    "ans": 1,
    "info": "Bolueta está en el distrito Begoña.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Bolueta estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Bolueta (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Bolueta (L1/L2) da servicio a Bolueta?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, Bolueta (L1/L2) es la estación de metro de Bolueta.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Bolueta?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Bolueta.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Bolueta",
     "Santutxu",
     "Abando",
     "Indautxu"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Parada de tranvía Bolueta (2022), en el antiguo apeadero de Euskotren»?",
    "opts": [
     "Arangoiti",
     "Bolueta",
     "Uribarri",
     "Albia"
    ],
    "ans": 1,
    "info": "«Parada de tranvía Bolueta (2022), en el antiguo apeadero de Euskotren» está en Bolueta.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bolueta",
    "fuenteTitulo": "Wikipedia: Bolueta"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Santa Ana de Bolueta, primera planta moderna de transformación de acero de Bizkaia (1840)»?",
    "opts": [
     "Begoña",
     "Uribarri",
     "Errekalde",
     "Abando"
    ],
    "ans": 0,
    "info": "«Santa Ana de Bolueta, primera planta moderna de transformación de acero de Bizkaia (1840)» está en Bolueta, distrito Begoña.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Bolueta",
    "fuenteTitulo": "Wikipedia: Bolueta"
   },
   {
    "q": "¿En qué distrito se encuentra «Entorno fluvial y zonas de paseo junto al Nervión y al parque de la ría»?",
    "opts": [
     "Ibaiondo",
     "Begoña",
     "Otxarkoaga-Txurdinaga",
     "Abando"
    ],
    "ans": 1,
    "info": "«Entorno fluvial y zonas de paseo junto al Nervión y al parque de la ría» está en Bolueta, distrito Begoña.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Bolueta",
    "fuenteTitulo": "Wikipedia: Bolueta"
   }
  ]
 },
 {
  "nombre": "Zazpikaleak",
  "distrito": "Ibaiondo",
  "lema": "Siete calles, siete secretos",
  "pintxo": {
   "nombre": "Pintxo de jamón de Zazpikaleak",
   "ingrediente": "jamón",
   "color": "#d9c37a",
   "forma": 1
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
   "https://es.wikipedia.org/wiki/Ibaiondo",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.bilbaoturismo.net/BilbaoTurismo/es/espacio-casco-viejo_2",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.euskotren.eus/sites/default/files/horarios/tranvia%20bilbao_horizontal-A3-%20Verano%202025_0.pdf"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Zazpikaleak?",
    "opts": [
     "Uribarri",
     "Ibaiondo",
     "Errekalde",
     "Begoña"
    ],
    "ans": 1,
    "info": "Zazpikaleak forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Zazpikaleak en el padrón de 2023?",
    "opts": [
     "12.897",
     "5103",
     "388",
     "7331"
    ],
    "ans": 3,
    "info": "El padrón municipal de 2023 registraba 7331 habitantes en Zazpikaleak.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Zazpikaleak?",
    "opts": [
     "25 ha",
     "51 ha",
     "15 ha",
     "129 ha"
    ],
    "ans": 1,
    "info": "Zazpikaleak ocupa aproximadamente 51 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Zazpikaleak?",
    "opts": [
     "143,7 hab/ha",
     "123,5 hab/ha",
     "135 hab/ha",
     "403 hab/ha"
    ],
    "ans": 0,
    "info": "La densidad de Zazpikaleak ronda los 143,7 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Zazpikaleak?",
    "opts": [
     "Zurbaranbarri (L3)",
     "Abando (L1/L2)",
     "Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Moyua (L1/L2)"
    ],
    "ans": 2,
    "info": "La estación de metro más próxima es Zazpikaleak/Casco Viejo (L1/L2/L3).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Zazpikaleak?",
    "opts": [
     "Metro, tranvía, tren y autobús",
     "Metro · San Inazio (L1/L2)",
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)",
     "Metro · Zazpikaleak/Casco Viejo (L1/L2/L3)"
    ],
    "ans": 3,
    "info": "Zazpikaleak: Metro · Zazpikaleak/Casco Viejo (L1/L2/L3). Intercambiador de las tres líneas de metro; tranvía en Arriaga y Ribera",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Zazpikaleak?",
    "opts": [
     "Basílica de Begoña, referencia del entorno",
     "Las Siete Calles: Somera, Artekale, Tendería, Belostikale, Carnicería Vieja, Barrenkale y Barrenkale Barrena",
     "Escultura 'Minotauro' en el Parque de Europa",
     "Monumento a Marx y Lenin en la plaza Kepa Enbeita, inaugurado en 1993 ('Lenin Eguna')"
    ],
    "ans": 1,
    "info": "«Las Siete Calles: Somera, Artekale, Tendería, Belostikale, Carnicería Vieja, Barrenkale y Barrenkale Barrena» es un hito de Zazpikaleak.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Casco Viejo (Bilbao)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Zazpikaleak?",
    "opts": [
     "Plaza Elíptica (Moyúa)",
     "Plaza Nueva",
     "Plaza de Zorrotzaurre",
     "Skatepark de Olabeaga"
    ],
    "ans": 1,
    "info": "«Plaza Nueva» está en Zazpikaleak.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Casco Viejo (Bilbao)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Zazpikaleak?",
    "opts": [
     "Gurtubay",
     "Ribera de Deusto",
     "Begoña",
     "Casco Viejo"
    ],
    "ans": 3,
    "info": "Zazpikaleak y Casco Viejo están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Zazpikaleak",
     "Albia",
     "Matiko",
     "Ribera de Deusto"
    ],
    "ans": 0,
    "info": "Zazpikaleak está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Zazpikaleak estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Zazpikaleak/Casco Viejo (L1/L2/L3).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Zazpikaleak/Casco Viejo (L1/L2/L3) da servicio a Zazpikaleak?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, Zazpikaleak/Casco Viejo (L1/L2/L3) es la estación de metro de Zazpikaleak.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Zazpikaleak?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Zazpikaleak.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Abando",
     "Santutxu",
     "Zazpikaleak",
     "Indautxu"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Txurdinaga",
     "Zorrotza",
     "Zazpikaleak",
     "Abando"
    ],
    "ans": 1,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Zazpikaleak",
     "Ametzola",
     "Iturralde",
     "Solokoetxe"
    ],
    "ans": 2,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Ibaiondo?",
    "opts": [
     "Zabala",
     "San Francisco",
     "Iturralde",
     "San Pedro de Deusto"
    ],
    "ans": 3,
    "info": "San Pedro de Deusto no está en Ibaiondo.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Zazpikaleak parada de tranvía?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Zazpikaleak cuenta con parada de tranvía.",
    "tipo": "tranviaTF",
    "fuente": "https://www.euskotren.eus/es/tranvia/bilbao",
    "fuenteTitulo": "Euskotren"
   },
   {
    "q": "¿El hito «Las Siete Calles: Somera, Artekale, Tendería, Belostikale, Carnicería Vieja, Barrenkale y Barrenkale Barrena» está en Zazpikaleak?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Zazpikaleak.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Casco Viejo (Bilbao)"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Zazpikaleak?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, ese hito no está en Zazpikaleak.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Casco Viejo (Bilbao)"
   }
  ]
 },
 {
  "nombre": "Casco Viejo",
  "distrito": "Ibaiondo",
  "lema": "El origen de todas las leyendas",
  "pintxo": {
   "nombre": "Pintxo de pulpo de Casco Viejo",
   "ingrediente": "pulpo",
   "color": "#d9c37a",
   "forma": 2
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
   "https://es.wikipedia.org/wiki/Ibaiondo",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.bilbaoturismo.net/BilbaoTurismo/es/espacio-casco-viejo_2",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.euskotren.eus/sites/default/files/horarios/tranvia%20bilbao_horizontal-A3-%20Verano%202025_0.pdf"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Casco Viejo?",
    "opts": [
     "Basurtu-Zorrotza",
     "Errekalde",
     "Ibaiondo",
     "Begoña"
    ],
    "ans": 2,
    "info": "Casco Viejo forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Casco Viejo en el padrón de 2023?",
    "opts": [
     "19.961",
     "14.851",
     "7331",
     "1685"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 7331 habitantes en Casco Viejo.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Casco Viejo?",
    "opts": [
     "15 ha",
     "14 ha",
     "51 ha",
     "32 ha"
    ],
    "ans": 2,
    "info": "Casco Viejo ocupa aproximadamente 51 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Casco Viejo?",
    "opts": [
     "447,7 hab/ha",
     "143,7 hab/ha",
     "85,3 hab/ha",
     "466,7 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Casco Viejo ronda los 143,7 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Casco Viejo?",
    "opts": [
     "Uribarri (L3)",
     "Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Zurbaranbarri (L3)",
     "Sarriko (L1/L2)"
    ],
    "ans": 1,
    "info": "La estación de metro más próxima es Zazpikaleak/Casco Viejo (L1/L2/L3).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Casco Viejo?",
    "opts": [
     "Metro · Santutxu (L1/L2)",
     "Tren · Renfe Cercanías Olabeaga",
     "Metro · Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Metro · Zurbaranbarri (L3)"
    ],
    "ans": 2,
    "info": "Casco Viejo: Metro · Zazpikaleak/Casco Viejo (L1/L2/L3). Intercambiador de las tres líneas de metro; tranvía en Arriaga y Ribera",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Casco Viejo?",
    "opts": [
     "Las Siete Calles: Somera, Artekale, Tendería, Belostikale, Carnicería Vieja, Barrenkale y Barrenkale Barrena",
     "Alto de Santo Domingo, mirador y paso del Camino de Santiago",
     "Grupo Cooperativo Arabella, levantado con la Ley de Casas Baratas de 1924",
     "Antigua Harino Panadera, origen del barrio"
    ],
    "ans": 0,
    "info": "«Las Siete Calles: Somera, Artekale, Tendería, Belostikale, Carnicería Vieja, Barrenkale y Barrenkale Barrena» es un hito de Casco Viejo.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Casco Viejo (Bilbao)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Casco Viejo?",
    "opts": [
     "Plaza de Latorre",
     "Jardines de Carmelo Larrea",
     "Paseo de la ría",
     "Plaza Nueva"
    ],
    "ans": 3,
    "info": "«Plaza Nueva» está en Casco Viejo.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Casco Viejo (Bilbao)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Casco Viejo?",
    "opts": [
     "San Ignacio",
     "Otxarkoaga",
     "Castaños",
     "Zazpikaleak"
    ],
    "ans": 3,
    "info": "Casco Viejo y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Otxarkoaga",
     "Casco Viejo",
     "Abando",
     "Txurdinaga"
    ],
    "ans": 1,
    "info": "Casco Viejo está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Casco Viejo estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Zazpikaleak/Casco Viejo (L1/L2/L3).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Zazpikaleak/Casco Viejo (L1/L2/L3) da servicio a Casco Viejo?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Zazpikaleak/Casco Viejo (L1/L2/L3) es la estación de metro de Casco Viejo.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Casco Viejo?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, Deustu (L1/L2) no es la estación de Casco Viejo.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Indautxu",
     "Abando",
     "Casco Viejo"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Zorrotza",
     "Abando",
     "Casco Viejo",
     "Txurdinaga"
    ],
    "ans": 0,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Casco Viejo",
     "Ametzola",
     "Iturralde",
     "Solokoetxe"
    ],
    "ans": 2,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Ibaiondo?",
    "opts": [
     "Zazpikaleak",
     "San Pedro de Deusto",
     "Iturralde",
     "La Peña"
    ],
    "ans": 1,
    "info": "San Pedro de Deusto no está en Ibaiondo.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Casco Viejo parada de tranvía?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, Casco Viejo cuenta con parada de tranvía.",
    "tipo": "tranviaTF",
    "fuente": "https://www.euskotren.eus/es/tranvia/bilbao",
    "fuenteTitulo": "Euskotren"
   },
   {
    "q": "¿El hito «Las Siete Calles: Somera, Artekale, Tendería, Belostikale, Carnicería Vieja, Barrenkale y Barrenkale Barrena» está en Casco Viejo?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Casco Viejo.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Casco Viejo (Bilbao)"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Casco Viejo?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese hito no está en Casco Viejo.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Casco_Viejo_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Casco Viejo (Bilbao)"
   }
  ]
 },
 {
  "nombre": "Bilbao La Vieja",
  "distrito": "Ibaiondo",
  "lema": "Piedra noble y arte rebelde",
  "pintxo": {
   "nombre": "Pintxo de berberecho de Bilbao La Vieja",
   "ingrediente": "berberecho",
   "color": "#ffd166",
   "forma": 3
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.bilbao.eus/cs/Satellite/bilbaoLaVieja/Llegar-a-Bilbao-la-Vieja/es/100256054/Contenido"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Bilbao La Vieja?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Basurtu-Zorrotza",
     "Ibaiondo",
     "Errekalde"
    ],
    "ans": 2,
    "info": "Bilbao La Vieja forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Bilbao La Vieja en el padrón de 2023?",
    "opts": [
     "5372",
     "14.851",
     "3882",
     "5261"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 3882 habitantes en Bilbao La Vieja.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Bilbao La Vieja?",
    "opts": [
     "77 ha",
     "14 ha",
     "17 ha",
     "38 ha"
    ],
    "ans": 1,
    "info": "Bilbao La Vieja ocupa aproximadamente 14 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Bilbao La Vieja?",
    "opts": [
     "120,8 hab/ha",
     "232,1 hab/ha",
     "277,3 hab/ha",
     "315,3 hab/ha"
    ],
    "ans": 2,
    "info": "La densidad de Bilbao La Vieja ronda los 277,3 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Bilbao La Vieja?",
    "opts": [
     "Metro (Moyua y Abando)",
     "Metro (Indautxu)",
     "Solo autobús",
     "Tranvía · T1 Atxuri"
    ],
    "ans": 2,
    "info": "Bilbao La Vieja: Solo autobús. Solo autobús; a pie de la parada de tranvía Ribera y del metro Casco Viejo",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Bilbao La Vieja?",
    "opts": [
     "Monte Banderas (223 m), en cuya falda se asienta el barrio",
     "Escuelas de Urazurrutia (1905), hoy sede de BilbaoArte",
     "Monte Artxanda",
     "Ermita de Santa Águeda"
    ],
    "ans": 1,
    "info": "«Escuelas de Urazurrutia (1905), hoy sede de BilbaoArte» es un hito de Bilbao La Vieja.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Escuelas de Urazurrutia (1905), hoy sede de BilbaoArte»?",
    "opts": [
     "Atxuri",
     "Bilbao La Vieja",
     "Miribilla",
     "Gurtubay"
    ],
    "ans": 1,
    "info": "«Escuelas de Urazurrutia (1905), hoy sede de BilbaoArte» está en Bilbao La Vieja.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Bilbao La Vieja?",
    "opts": [
     "Parque de Europa (107.000 m², 1988)",
     "Plaza Tres Pilares",
     "Plaza de Basurtugorta",
     "Plaza de Indautxu"
    ],
    "ans": 1,
    "info": "«Plaza Tres Pilares» está en Bilbao La Vieja.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Tres Pilares»?",
    "opts": [
     "Castaños",
     "Bilbao La Vieja",
     "Gurtubay",
     "Indautxu"
    ],
    "ans": 1,
    "info": "«Plaza Tres Pilares» pertenece a Bilbao La Vieja.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Casa Socorro (1914), hoy Kultur Etxea»?",
    "opts": [
     "Guggenheim - Ensanche",
     "Zabala",
     "Miribilla",
     "Bilbao La Vieja"
    ],
    "ans": 3,
    "info": "«Casa Socorro (1914), hoy Kultur Etxea» está en Bilbao La Vieja.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Saralegi»?",
    "opts": [
     "Bilbao La Vieja",
     "Matiko",
     "Otxarkoaga",
     "San Francisco"
    ],
    "ans": 0,
    "info": "«Plaza Saralegi» pertenece a Bilbao La Vieja.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Bilbao La Vieja?",
    "opts": [
     "Castaños",
     "Zazpikaleak",
     "Kastrexana",
     "Artxanda"
    ],
    "ans": 1,
    "info": "Bilbao La Vieja y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Bilbao La Vieja",
     "Zorrotzaurre",
     "Zorrotza",
     "Basurto"
    ],
    "ans": 0,
    "info": "Bilbao La Vieja está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Bilbao La Vieja estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Bilbao La Vieja no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Bilbao La Vieja",
     "Indautxu",
     "Abando"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Galería y horno de calcinación de la mina San Luis»?",
    "opts": [
     "Arangoiti",
     "Uribarri",
     "Bilbao La Vieja",
     "La Peña"
    ],
    "ans": 2,
    "info": "«Galería y horno de calcinación de la mina San Luis» está en Bilbao La Vieja.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Martzana»?",
    "opts": [
     "Bilbao La Vieja",
     "Iturrigorri - Peñascal",
     "Mina del Morro",
     "San Ignacio"
    ],
    "ans": 0,
    "info": "«Plaza de Martzana» pertenece a Bilbao La Vieja.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Escuelas de Urazurrutia (1905), hoy sede de BilbaoArte»?",
    "opts": [
     "Uribarri",
     "Errekalde",
     "Ibaiondo",
     "Begoña"
    ],
    "ans": 2,
    "info": "«Escuelas de Urazurrutia (1905), hoy sede de BilbaoArte» está en Bilbao La Vieja, distrito Ibaiondo.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza Tres Pilares»?",
    "opts": [
     "Begoña",
     "Uribarri",
     "Ibaiondo",
     "Abando"
    ],
    "ans": 2,
    "info": "«Plaza Tres Pilares» está en Bilbao La Vieja, distrito Ibaiondo.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Bilbao_la_Vieja",
    "fuenteTitulo": "Wikipedia: Bilbao la Vieja"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Bilbao La Vieja",
     "Zorrotza",
     "Txurdinaga",
     "Abando"
    ],
    "ans": 1,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "San Francisco",
  "distrito": "Ibaiondo",
  "lema": "Colores y aromas de todo el orbe",
  "pintxo": {
   "nombre": "Pintxo de calamar de San Francisco",
   "ingrediente": "calamar",
   "color": "#ffd166",
   "forma": 4
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de San Francisco?",
    "opts": [
     "Abando",
     "Ibaiondo",
     "Errekalde",
     "Uribarri"
    ],
    "ans": 1,
    "info": "San Francisco forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía San Francisco en el padrón de 2023?",
    "opts": [
     "6912",
     "590",
     "12.135",
     "452"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 6912 habitantes en San Francisco.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene San Francisco?",
    "opts": [
     "47 ha",
     "129 ha",
     "17 ha",
     "39 ha"
    ],
    "ans": 2,
    "info": "San Francisco ocupa aproximadamente 17 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de San Francisco?",
    "opts": [
     "406,6 hab/ha",
     "466,7 hab/ha",
     "85,3 hab/ha",
     "143,7 hab/ha"
    ],
    "ans": 0,
    "info": "La densidad de San Francisco ronda los 406,6 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de San Francisco?",
    "opts": [
     "Metro · Uribarri (L3)",
     "Solo autobús",
     "Metro (Indautxu)",
     "Metro · Zazpikaleak/Casco Viejo (L1/L2/L3)"
    ],
    "ans": 1,
    "info": "San Francisco: Solo autobús. Solo autobús; próxima la estación de Zabálburu",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de San Francisco?",
    "opts": [
     "Memoria de la cantera de la mina 'Rosita' (catástrofe de 1899)",
     "Pasarela Zubizuri",
     "Memoria del convento de San Francisco (bula de 1475), que da nombre al barrio",
     "Calle Bruno Mauricio de Zabala, arteria del barrio"
    ],
    "ans": 2,
    "info": "«Memoria del convento de San Francisco (bula de 1475), que da nombre al barrio» es un hito de San Francisco.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Memoria del convento de San Francisco (bula de 1475), que da nombre al barrio»?",
    "opts": [
     "Ciudad Jardín",
     "San Francisco",
     "Masustegi",
     "Monte Caramelo"
    ],
    "ans": 1,
    "info": "«Memoria del convento de San Francisco (bula de 1475), que da nombre al barrio» está en San Francisco.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a San Francisco?",
    "opts": [
     "Plaza con centro social de la urbanización y red de senderos",
     "Plaza de Moraza",
     "Plaza de la Cantera",
     "Plaza de Latorre"
    ],
    "ans": 2,
    "info": "«Plaza de la Cantera» está en San Francisco.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de la Cantera»?",
    "opts": [
     "Uribarri",
     "San Francisco",
     "Albia",
     "Indautxu"
    ],
    "ans": 1,
    "info": "«Plaza de la Cantera» pertenece a San Francisco.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Iglesia del Corazón de María»?",
    "opts": [
     "Arabella",
     "Indautxu",
     "San Francisco",
     "Uretamendi"
    ],
    "ans": 2,
    "info": "«Iglesia del Corazón de María» está en San Francisco.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Corazón de María»?",
    "opts": [
     "Arabella",
     "San Francisco",
     "Santutxu",
     "Ametzola"
    ],
    "ans": 1,
    "info": "«Plaza Corazón de María» pertenece a San Francisco.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que San Francisco?",
    "opts": [
     "Guggenheim - Ensanche",
     "Zazpikaleak",
     "Masustegi",
     "Albia"
    ],
    "ans": 1,
    "info": "San Francisco y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Ametzola",
     "San Francisco",
     "Abando",
     "Masustegi"
    ],
    "ans": 1,
    "info": "San Francisco está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene San Francisco estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "San Francisco no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "San Francisco",
     "Santutxu",
     "Abando"
    ],
    "ans": 2,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Calle San Francisco como eje comercial multicultural»?",
    "opts": [
     "San Francisco",
     "Altamira",
     "Artxanda",
     "Castaños"
    ],
    "ans": 0,
    "info": "«Calle San Francisco como eje comercial multicultural» está en San Francisco.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de las Mujeres 25 de Noviembre»?",
    "opts": [
     "Txurdinaga",
     "Abando",
     "San Francisco",
     "Arangoiti"
    ],
    "ans": 2,
    "info": "«Plaza de las Mujeres 25 de Noviembre» pertenece a San Francisco.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Memoria del convento de San Francisco (bula de 1475), que da nombre al barrio»?",
    "opts": [
     "Ibaiondo",
     "Basurtu-Zorrotza",
     "Deustu",
     "Uribarri"
    ],
    "ans": 0,
    "info": "«Memoria del convento de San Francisco (bula de 1475), que da nombre al barrio» está en San Francisco, distrito Ibaiondo.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de la Cantera»?",
    "opts": [
     "Ibaiondo",
     "Errekalde",
     "Otxarkoaga-Txurdinaga",
     "Uribarri"
    ],
    "ans": 0,
    "info": "«Plaza de la Cantera» está en San Francisco, distrito Ibaiondo.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/San_Francisco_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Francisco (Bilbao)"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "San Francisco",
     "Txurdinaga",
     "Zorrotza",
     "Abando"
    ],
    "ans": 2,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Zabala",
  "distrito": "Ibaiondo",
  "lema": "Calles férreas al cobijo del tren",
  "pintxo": {
   "nombre": "Pintxo de tortilla de patata de Zabala",
   "ingrediente": "tortilla de patata",
   "color": "#e08a4a",
   "forma": 5
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaokultura.eus/wp-content/uploads/2021/07/Conoce-ZABALA-caminando-v.4.pdf",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://es.wikipedia.org/wiki/Zabala_(Bilbao)",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Zabala?",
    "opts": [
     "Uribarri",
     "Errekalde",
     "Begoña",
     "Ibaiondo"
    ],
    "ans": 3,
    "info": "Zabala forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Zabala en el padrón de 2023?",
    "opts": [
     "5372",
     "14.772",
     "4259",
     "171"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 5372 habitantes en Zabala.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Zabala?",
    "opts": [
     "47 ha",
     "12 ha",
     "79 ha",
     "13 ha"
    ],
    "ans": 1,
    "info": "Zabala ocupa aproximadamente 12 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Zabala?",
    "opts": [
     "263 hab/ha",
     "123,5 hab/ha",
     "222,8 hab/ha",
     "447,7 hab/ha"
    ],
    "ans": 3,
    "info": "La densidad de Zabala ronda los 447,7 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Zabala?",
    "opts": [
     "Tren (FEVE) y autobús",
     "Tren · Renfe Cercanías Olabeaga",
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)",
     "Metro · Santimami/San Mamés (L1/L2)"
    ],
    "ans": 2,
    "info": "Zabala: Tren · Renfe Cercanías Zabalburu (C-1/C-2). La estación de Zabálburu da servicio al barrio",
    "tipo": "access",
    "fuente": "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
    "fuenteTitulo": "Renfe"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Zabala?",
    "opts": [
     "Estación de Ametzola, cubierta por la galería del parque",
     "Casas ferroviarias de 1922: siete grupos con 275 viviendas",
     "Jardines de Albia, en el Ensanche",
     "Antiguo lavadero de Castaños, obra de Ricardo Bastida"
    ],
    "ans": 1,
    "info": "«Casas ferroviarias de 1922: siete grupos con 275 viviendas» es un hito de Zabala.",
    "tipo": "hitoId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/07/Conoce-ZABALA-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Casas ferroviarias de 1922: siete grupos con 275 viviendas»?",
    "opts": [
     "Indautxu",
     "San Pedro de Deusto",
     "Zabala",
     "Santutxu"
    ],
    "ans": 2,
    "info": "«Casas ferroviarias de 1922: siete grupos con 275 viviendas» está en Zabala.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/07/Conoce-ZABALA-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Zabala?",
    "opts": [
     "Plaza Dr. Fleming",
     "Merenderos de la cumbre",
     "Plaza de la Cantera",
     "Plaza de Uzturre"
    ],
    "ans": 0,
    "info": "«Plaza Dr. Fleming» está en Zabala.",
    "tipo": "espacioId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/07/Conoce-ZABALA-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Dr. Fleming»?",
    "opts": [
     "Iralabarri",
     "Zabala",
     "Iturrigorri - Peñascal",
     "Indautxu"
    ],
    "ans": 1,
    "info": "«Plaza Dr. Fleming» pertenece a Zabala.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/07/Conoce-ZABALA-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Calle Bruno Mauricio de Zabala, arteria del barrio»?",
    "opts": [
     "Ribera de Deusto",
     "Zabala",
     "Zorrotza",
     "Artxanda"
    ],
    "ans": 1,
    "info": "«Calle Bruno Mauricio de Zabala, arteria del barrio» está en Zabala.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/07/Conoce-ZABALA-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Zabala?",
    "opts": [
     "Uribarri",
     "Zazpikaleak",
     "Uretamendi",
     "Elorrieta"
    ],
    "ans": 1,
    "info": "Zabala y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Zabala",
     "Iralabarri",
     "Zorrotza",
     "Iturrigorri - Peñascal"
    ],
    "ans": 0,
    "info": "Zabala está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Zabala estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Zabala no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Zabala",
     "Indautxu",
     "Santutxu",
     "Abando"
    ],
    "ans": 2,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de Zabálburu (C-1/C-2)»?",
    "opts": [
     "Campuzano",
     "Matiko",
     "Betolaza",
     "Zabala"
    ],
    "ans": 3,
    "info": "«Estación de Zabálburu (C-1/C-2)» está en Zabala.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/07/Conoce-ZABALA-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Casas ferroviarias de 1922: siete grupos con 275 viviendas»?",
    "opts": [
     "Errekalde",
     "Deustu",
     "Ibaiondo",
     "Uribarri"
    ],
    "ans": 2,
    "info": "«Casas ferroviarias de 1922: siete grupos con 275 viviendas» está en Zabala, distrito Ibaiondo.",
    "tipo": "hitoDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/07/Conoce-ZABALA-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza Dr. Fleming»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Ibaiondo",
     "Begoña",
     "Deustu"
    ],
    "ans": 1,
    "info": "«Plaza Dr. Fleming» está en Zabala, distrito Ibaiondo.",
    "tipo": "espacioDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/07/Conoce-ZABALA-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Zorrotza",
     "Abando",
     "Txurdinaga",
     "Zabala"
    ],
    "ans": 0,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Solokoetxe",
     "Iturralde",
     "Zabala",
     "Ametzola"
    ],
    "ans": 1,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Ibaiondo?",
    "opts": [
     "Bilbao La Vieja",
     "Miribilla",
     "San Pedro de Deusto",
     "Iturralde"
    ],
    "ans": 2,
    "info": "San Pedro de Deusto no está en Ibaiondo.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Atxuri",
  "distrito": "Ibaiondo",
  "lema": "La vieja estación que mira a los montes",
  "pintxo": {
   "nombre": "Pintxo de txampiñón de Atxuri",
   "ingrediente": "txampiñón",
   "color": "#ffd166",
   "forma": 0
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://es.wikipedia.org/wiki/Achuri",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.euskotren.eus/sites/default/files/horarios/tranvia%20bilbao_horizontal-A3-%20Verano%202025_0.pdf"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Atxuri?",
    "opts": [
     "Basurtu-Zorrotza",
     "Begoña",
     "Abando",
     "Ibaiondo"
    ],
    "ans": 3,
    "info": "Atxuri forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Atxuri en el padrón de 2023?",
    "opts": [
     "6912",
     "12.135",
     "12.691",
     "5675"
    ],
    "ans": 3,
    "info": "El padrón municipal de 2023 registraba 5675 habitantes en Atxuri.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Atxuri?",
    "opts": [
     "81 ha",
     "129 ha",
     "25 ha",
     "18 ha"
    ],
    "ans": 3,
    "info": "Atxuri ocupa aproximadamente 18 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Atxuri?",
    "opts": [
     "447,7 hab/ha",
     "478,1 hab/ha",
     "403 hab/ha",
     "315,3 hab/ha"
    ],
    "ans": 3,
    "info": "La densidad de Atxuri ronda los 315,3 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Atxuri?",
    "opts": [
     "Tranvía · T1 Atxuri",
     "Metro (Moyua y Abando)",
     "Metro, tranvía, tren y autobús",
     "Metro (Indautxu)"
    ],
    "ans": 0,
    "info": "Atxuri: Tranvía · T1 Atxuri. Cabecera del tranvía en la estación histórica de Atxuri (1913, Manuel M. Smith)",
    "tipo": "access",
    "fuente": "https://www.euskotren.eus/es/tranvia/bilbao",
    "fuenteTitulo": "Euskotren"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Atxuri?",
    "opts": [
     "Cementerio de Deusto",
     "Estación de Atxuri (1913, Manuel María Smith), hoy cabecera del tranvía",
     "Viacrucis y Calzadas de Mallona de subida a la basílica",
     "Parroquia de San Luis Beltrán (1946)"
    ],
    "ans": 1,
    "info": "«Estación de Atxuri (1913, Manuel María Smith), hoy cabecera del tranvía» es un hito de Atxuri.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de Atxuri (1913, Manuel María Smith), hoy cabecera del tranvía»?",
    "opts": [
     "Castaños",
     "Olabeaga",
     "Atxuri",
     "Solokoetxe"
    ],
    "ans": 2,
    "info": "«Estación de Atxuri (1913, Manuel María Smith), hoy cabecera del tranvía» está en Atxuri.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Atxuri?",
    "opts": [
     "Parque de Europa (107.000 m², 1988)",
     "Parque de Larreagaburu",
     "Plaza de la Encarnación",
     "Jardines de Iparralde"
    ],
    "ans": 2,
    "info": "«Plaza de la Encarnación» está en Atxuri.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de la Encarnación»?",
    "opts": [
     "Atxuri",
     "Basurto",
     "Santutxu",
     "Altamira"
    ],
    "ans": 0,
    "info": "«Plaza de la Encarnación» pertenece a Atxuri.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Iglesia de San Antón»?",
    "opts": [
     "Atxuri",
     "Artxanda",
     "San Ignacio",
     "Begoña"
    ],
    "ans": 0,
    "info": "«Iglesia de San Antón» está en Atxuri.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de la Encarnación»?",
    "opts": [
     "Atxuri",
     "Basurto",
     "Olabeaga",
     "Betolaza"
    ],
    "ans": 0,
    "info": "«Parque de la Encarnación» pertenece a Atxuri.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Atxuri?",
    "opts": [
     "Zazpikaleak",
     "Ibarrekolanda",
     "Ribera de Deusto",
     "Masustegi"
    ],
    "ans": 0,
    "info": "Atxuri y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Olabeaga",
     "Zurbaran",
     "Arangoiti",
     "Atxuri"
    ],
    "ans": 3,
    "info": "Atxuri está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Atxuri estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Atxuri no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Santutxu",
     "Abando",
     "Atxuri"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Antiguo hospital de Bilbao, primera sede del Museo de Bellas Artes (1914) y hoy instituto Emilio Campuzano»?",
    "opts": [
     "San Mamés",
     "Atxuri",
     "Otxarkoaga",
     "Zorrotzaurre"
    ],
    "ans": 1,
    "info": "«Antiguo hospital de Bilbao, primera sede del Museo de Bellas Artes (1914) y hoy instituto Emilio Campuzano» está en Atxuri.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de los Santos Juanes»?",
    "opts": [
     "Iralabarri",
     "San Francisco",
     "Atxuri",
     "Kastrexana"
    ],
    "ans": 2,
    "info": "«Plaza de los Santos Juanes» pertenece a Atxuri.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Estación de Atxuri (1913, Manuel María Smith), hoy cabecera del tranvía»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Ibaiondo",
     "Deustu",
     "Begoña"
    ],
    "ans": 1,
    "info": "«Estación de Atxuri (1913, Manuel María Smith), hoy cabecera del tranvía» está en Atxuri, distrito Ibaiondo.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de la Encarnación»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Errekalde",
     "Basurtu-Zorrotza",
     "Ibaiondo"
    ],
    "ans": 3,
    "info": "«Plaza de la Encarnación» está en Atxuri, distrito Ibaiondo.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Achuri",
    "fuenteTitulo": "Wikipedia: Achuri"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Zorrotza",
     "Txurdinaga",
     "Atxuri",
     "Abando"
    ],
    "ans": 0,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Iturralde",
  "distrito": "Ibaiondo",
  "lema": "Fuentes tranquilas junto al Casco",
  "pintxo": {
   "nombre": "Pintxo de pimiento verde de Iturralde",
   "ingrediente": "pimiento verde",
   "color": "#d9c37a",
   "forma": 1
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://ca.wikipedia.org/wiki/Iturrialde",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Iturralde?",
    "opts": [
     "Uribarri",
     "Ibaiondo",
     "Begoña",
     "Deustu"
    ],
    "ans": 1,
    "info": "Iturralde forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Iturralde en el padrón de 2023?",
    "opts": [
     "5737",
     "19.961",
     "4259",
     "1685"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 5737 habitantes en Iturralde.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Iturralde?",
    "opts": [
     "77 ha",
     "26 ha",
     "12 ha",
     "41 ha"
    ],
    "ans": 2,
    "info": "Iturralde ocupa aproximadamente 12 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Iturralde?",
    "opts": [
     "315,3 hab/ha",
     "218,2 hab/ha",
     "93,3 hab/ha",
     "478,1 hab/ha"
    ],
    "ans": 3,
    "info": "La densidad de Iturralde ronda los 478,1 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Iturralde?",
    "opts": [
     "Metro · Santutxu (L1/L2)",
     "Solo autobús",
     "Metro · Bolueta (L1/L2)",
     "Metro · Uribarri (L3)"
    ],
    "ans": 1,
    "info": "Iturralde: Solo autobús. Solo autobús; entre Casco Viejo y Santutxu por Iturribide",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Iturralde?",
    "opts": [
     "Estación de Atxuri (1913, Manuel María Smith), hoy cabecera del tranvía",
     "Restaurante El Amparo, antiguo caserío",
     "Museo de Pasos de Semana Santa de Bilbao",
     "Estadio San Mamés, inaugurado en 2013"
    ],
    "ans": 2,
    "info": "«Museo de Pasos de Semana Santa de Bilbao» es un hito de Iturralde.",
    "tipo": "hitoId",
    "fuente": "https://ca.wikipedia.org/wiki/Iturrialde",
    "fuenteTitulo": "Wikipedia (ca): Iturrialde"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Museo de Pasos de Semana Santa de Bilbao»?",
    "opts": [
     "San Adrián",
     "Zabala",
     "San Mamés",
     "Iturralde"
    ],
    "ans": 3,
    "info": "«Museo de Pasos de Semana Santa de Bilbao» está en Iturralde.",
    "tipo": "hitoRev",
    "fuente": "https://ca.wikipedia.org/wiki/Iturrialde",
    "fuenteTitulo": "Wikipedia (ca): Iturrialde"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Iturralde?",
    "opts": [
     "Jardines de Intxaurtxueta",
     "Plaza Tomás Meabe",
     "Plaza de la Salve",
     "Parque de Miribilla (50.000 m²), atalaya sobre Bilbao"
    ],
    "ans": 1,
    "info": "«Plaza Tomás Meabe» está en Iturralde.",
    "tipo": "espacioId",
    "fuente": "https://ca.wikipedia.org/wiki/Iturrialde",
    "fuenteTitulo": "Wikipedia (ca): Iturrialde"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Tomás Meabe»?",
    "opts": [
     "Iralabarri",
     "Zorrotza",
     "Iturralde",
     "Basurto"
    ],
    "ans": 2,
    "info": "«Plaza Tomás Meabe» pertenece a Iturralde.",
    "tipo": "espacioRev",
    "fuente": "https://ca.wikipedia.org/wiki/Iturrialde",
    "fuenteTitulo": "Wikipedia (ca): Iturrialde"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Calle Iturribide, eje entre Casco Viejo y Santutxu»?",
    "opts": [
     "Kastrexana",
     "Ibarrekolanda",
     "Guggenheim - Ensanche",
     "Iturralde"
    ],
    "ans": 3,
    "info": "«Calle Iturribide, eje entre Casco Viejo y Santutxu» está en Iturralde.",
    "tipo": "hitoRev",
    "fuente": "https://ca.wikipedia.org/wiki/Iturrialde",
    "fuenteTitulo": "Wikipedia (ca): Iturrialde"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Iturralde?",
    "opts": [
     "Zazpikaleak",
     "Castaños",
     "San Mamés",
     "Monte Caramelo"
    ],
    "ans": 0,
    "info": "Iturralde y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Ribera de Deusto",
     "Zurbaran",
     "Zorrotza",
     "Iturralde"
    ],
    "ans": 3,
    "info": "Iturralde está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Iturralde estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Iturralde no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Iturralde",
     "Santutxu",
     "Indautxu",
     "Abando"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Museo de Pasos de Semana Santa de Bilbao»?",
    "opts": [
     "Ibaiondo",
     "Abando",
     "Begoña",
     "Uribarri"
    ],
    "ans": 0,
    "info": "«Museo de Pasos de Semana Santa de Bilbao» está en Iturralde, distrito Ibaiondo.",
    "tipo": "hitoDistrito",
    "fuente": "https://ca.wikipedia.org/wiki/Iturrialde",
    "fuenteTitulo": "Wikipedia (ca): Iturrialde"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza Tomás Meabe»?",
    "opts": [
     "Abando",
     "Errekalde",
     "Basurtu-Zorrotza",
     "Ibaiondo"
    ],
    "ans": 3,
    "info": "«Plaza Tomás Meabe» está en Iturralde, distrito Ibaiondo.",
    "tipo": "espacioDistrito",
    "fuente": "https://ca.wikipedia.org/wiki/Iturrialde",
    "fuenteTitulo": "Wikipedia (ca): Iturrialde"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Abando",
     "Txurdinaga",
     "Iturralde",
     "Zorrotza"
    ],
    "ans": 3,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Zabala",
     "Ametzola",
     "Iturralde",
     "Solokoetxe"
    ],
    "ans": 2,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Ibaiondo?",
    "opts": [
     "San Francisco",
     "La Peña",
     "San Pedro de Deusto",
     "Zabala"
    ],
    "ans": 2,
    "info": "San Pedro de Deusto no está en Ibaiondo.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Museo de Pasos de Semana Santa de Bilbao» está en Iturralde?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Iturralde.",
    "tipo": "tfHitoYes",
    "fuente": "https://ca.wikipedia.org/wiki/Iturrialde",
    "fuenteTitulo": "Wikipedia (ca): Iturrialde"
   }
  ]
 },
 {
  "nombre": "Solokoetxe",
  "distrito": "Ibaiondo",
  "lema": "Espinazo de peldaños infinitos",
  "pintxo": {
   "nombre": "Pintxo de huevo de Solokoetxe",
   "ingrediente": "huevo",
   "color": "#ffd166",
   "forma": 2
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://ca.wikipedia.org/wiki/Solokoetxe",
   "https://santutxuzaharra.com/solokoetxe/",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Solokoetxe?",
    "opts": [
     "Abando",
     "Otxarkoaga-Txurdinaga",
     "Deustu",
     "Ibaiondo"
    ],
    "ans": 3,
    "info": "Solokoetxe forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Solokoetxe en el padrón de 2023?",
    "opts": [
     "5103",
     "388",
     "9679",
     "10.520"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 5103 habitantes en Solokoetxe.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Solokoetxe?",
    "opts": [
     "26 ha",
     "81 ha",
     "39 ha",
     "11 ha"
    ],
    "ans": 3,
    "info": "Solokoetxe ocupa aproximadamente 11 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Solokoetxe?",
    "opts": [
     "206,3 hab/ha",
     "156,8 hab/ha",
     "123,5 hab/ha",
     "463,9 hab/ha"
    ],
    "ans": 3,
    "info": "La densidad de Solokoetxe ronda los 463,9 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Solokoetxe?",
    "opts": [
     "Metro · Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Metro · Santutxu (L1/L2)",
     "Solo autobús",
     "Tren · Renfe Cercanías Olabeaga"
    ],
    "ans": 2,
    "info": "Solokoetxe: Solo autobús. Solo autobús",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Solokoetxe?",
    "opts": [
     "Colegio de los jesuitas",
     "Monte Artxanda",
     "Parque de Mina del Morro, en la ladera de Santutxu",
     "Antiguo hospital de Solokoetxe (1891-1892, Edesio Garamendi), hoy instituto"
    ],
    "ans": 3,
    "info": "«Antiguo hospital de Solokoetxe (1891-1892, Edesio Garamendi), hoy instituto» es un hito de Solokoetxe.",
    "tipo": "hitoId",
    "fuente": "https://ca.wikipedia.org/wiki/Solokoetxe",
    "fuenteTitulo": "Wikipedia (ca): Solokoetxe"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Antiguo hospital de Solokoetxe (1891-1892, Edesio Garamendi), hoy instituto»?",
    "opts": [
     "Ciudad Jardín",
     "Solokoetxe",
     "Bilbao La Vieja",
     "Guggenheim - Ensanche"
    ],
    "ans": 1,
    "info": "«Antiguo hospital de Solokoetxe (1891-1892, Edesio Garamendi), hoy instituto» está en Solokoetxe.",
    "tipo": "hitoRev",
    "fuente": "https://ca.wikipedia.org/wiki/Solokoetxe",
    "fuenteTitulo": "Wikipedia (ca): Solokoetxe"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Solokoetxe?",
    "opts": [
     "Parque del Ferial",
     "Plaza de Levante",
     "Jardines de Solokoetxe",
     "Área deportiva de la plaza de la Encarnación"
    ],
    "ans": 2,
    "info": "«Jardines de Solokoetxe» está en Solokoetxe.",
    "tipo": "espacioId",
    "fuente": "https://ca.wikipedia.org/wiki/Solokoetxe",
    "fuenteTitulo": "Wikipedia (ca): Solokoetxe"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Jardines de Solokoetxe»?",
    "opts": [
     "Solokoetxe",
     "Castaños",
     "San Pedro de Deusto",
     "Arangoiti"
    ],
    "ans": 0,
    "info": "«Jardines de Solokoetxe» pertenece a Solokoetxe.",
    "tipo": "espacioRev",
    "fuente": "https://ca.wikipedia.org/wiki/Solokoetxe",
    "fuenteTitulo": "Wikipedia (ca): Solokoetxe"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Escuelas públicas de Solokoetxe»?",
    "opts": [
     "Santutxu",
     "Campuzano",
     "Otxarkoaga",
     "Solokoetxe"
    ],
    "ans": 3,
    "info": "«Escuelas públicas de Solokoetxe» está en Solokoetxe.",
    "tipo": "hitoRev",
    "fuente": "https://ca.wikipedia.org/wiki/Solokoetxe",
    "fuenteTitulo": "Wikipedia (ca): Solokoetxe"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Zumárraga»?",
    "opts": [
     "Kastrexana",
     "San Mamés",
     "Artxanda",
     "Solokoetxe"
    ],
    "ans": 3,
    "info": "«Plaza de Zumárraga» pertenece a Solokoetxe.",
    "tipo": "espacioRev",
    "fuente": "https://ca.wikipedia.org/wiki/Solokoetxe",
    "fuenteTitulo": "Wikipedia (ca): Solokoetxe"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Solokoetxe?",
    "opts": [
     "Zorrotzaurre",
     "Betolaza",
     "Abando",
     "Zazpikaleak"
    ],
    "ans": 3,
    "info": "Solokoetxe y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Elorrieta",
     "Solokoetxe",
     "Castaños",
     "San Ignacio"
    ],
    "ans": 1,
    "info": "Solokoetxe está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Solokoetxe estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Solokoetxe no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Solokoetxe",
     "Santutxu",
     "Abando",
     "Indautxu"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Antiguo hospital de Solokoetxe (1891-1892, Edesio Garamendi), hoy instituto»?",
    "opts": [
     "Uribarri",
     "Deustu",
     "Errekalde",
     "Ibaiondo"
    ],
    "ans": 3,
    "info": "«Antiguo hospital de Solokoetxe (1891-1892, Edesio Garamendi), hoy instituto» está en Solokoetxe, distrito Ibaiondo.",
    "tipo": "hitoDistrito",
    "fuente": "https://ca.wikipedia.org/wiki/Solokoetxe",
    "fuenteTitulo": "Wikipedia (ca): Solokoetxe"
   },
   {
    "q": "¿En qué distrito se encuentra «Jardines de Solokoetxe»?",
    "opts": [
     "Begoña",
     "Uribarri",
     "Ibaiondo",
     "Errekalde"
    ],
    "ans": 2,
    "info": "«Jardines de Solokoetxe» está en Solokoetxe, distrito Ibaiondo.",
    "tipo": "espacioDistrito",
    "fuente": "https://ca.wikipedia.org/wiki/Solokoetxe",
    "fuenteTitulo": "Wikipedia (ca): Solokoetxe"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Abando",
     "Txurdinaga",
     "Zorrotza",
     "Solokoetxe"
    ],
    "ans": 2,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Iturralde",
     "Solokoetxe",
     "Ametzola",
     "Zabala"
    ],
    "ans": 0,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Ibaiondo?",
    "opts": [
     "Miribilla",
     "Iturralde",
     "San Pedro de Deusto",
     "Atxuri"
    ],
    "ans": 2,
    "info": "San Pedro de Deusto no está en Ibaiondo.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "La Peña",
  "distrito": "Ibaiondo",
  "lema": "Agua brava bajo las peñas",
  "pintxo": {
   "nombre": "Pintxo de langostino de La Peña",
   "ingrediente": "langostino",
   "color": "#f2d27a",
   "forma": 3
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.euskotren.eus/sites/default/files/horarios/tranvia%20bilbao_horizontal-A3-%20Verano%202025_0.pdf"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de La Peña?",
    "opts": [
     "Abando",
     "Ibaiondo",
     "Errekalde",
     "Deustu"
    ],
    "ans": 1,
    "info": "La Peña forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía La Peña en el padrón de 2023?",
    "opts": [
     "1679",
     "5261",
     "7370",
     "10.520"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 7370 habitantes en La Peña.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene La Peña?",
    "opts": [
     "55 ha",
     "47 ha",
     "18 ha",
     "20 ha"
    ],
    "ans": 1,
    "info": "La Peña ocupa aproximadamente 47 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de La Peña?",
    "opts": [
     "156,8 hab/ha",
     "143,7 hab/ha",
     "277,3 hab/ha",
     "406,6 hab/ha"
    ],
    "ans": 0,
    "info": "La densidad de La Peña ronda los 156,8 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de La Peña?",
    "opts": [
     "Funicular de Artxanda y autobús",
     "Autobús y pasarelas peatonales",
     "Tranvía · T1 Abusu",
     "Metro, tranvía, tren y autobús"
    ],
    "ans": 2,
    "info": "La Peña: Tranvía · T1 Abusu. Estación de Cercanías La Peña; parada de tranvía Abusu en el límite",
    "tipo": "access",
    "fuente": "https://www.euskotren.eus/es/tranvia/bilbao",
    "fuenteTitulo": "Euskotren"
   },
   {
    "q": "¿Cuál de estos hitos es característico de La Peña?",
    "opts": [
     "Ermita de Nuestra Señora de La Peña de Francia, que da nombre al barrio",
     "Cargadero de Olabeaga (1894) y cargadero Gandarias",
     "Museo Guggenheim Bilbao",
     "Facultad de Economía y Empresa (Sarriko, 1962, Rafael Basterrechea)"
    ],
    "ans": 0,
    "info": "«Ermita de Nuestra Señora de La Peña de Francia, que da nombre al barrio» es un hito de La Peña.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
    "fuenteTitulo": "Wikipedia: La Peña (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Ermita de Nuestra Señora de La Peña de Francia, que da nombre al barrio»?",
    "opts": [
     "San Mamés",
     "La Peña",
     "Iralabarri",
     "Zorrotza"
    ],
    "ans": 1,
    "info": "«Ermita de Nuestra Señora de La Peña de Francia, que da nombre al barrio» está en La Peña.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
    "fuenteTitulo": "Wikipedia: La Peña (Bilbao)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a La Peña?",
    "opts": [
     "Plaza Belate",
     "Jardines de La Floresta",
     "Plaza de Neguruela",
     "Parque de Ibaieder, con tirolina y zona de skate"
    ],
    "ans": 3,
    "info": "«Parque de Ibaieder, con tirolina y zona de skate» está en La Peña.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
    "fuenteTitulo": "Wikipedia: La Peña (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Ibaieder, con tirolina y zona de skate»?",
    "opts": [
     "Betolaza",
     "La Peña",
     "Basurto",
     "Mina del Morro"
    ],
    "ans": 1,
    "info": "«Parque de Ibaieder, con tirolina y zona de skate» pertenece a La Peña.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
    "fuenteTitulo": "Wikipedia: La Peña (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estaciones de Cercanías La Peña y Ollargan»?",
    "opts": [
     "Kastrexana",
     "Bolueta",
     "La Peña",
     "Casco Viejo"
    ],
    "ans": 2,
    "info": "«Estaciones de Cercanías La Peña y Ollargan» está en La Peña.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
    "fuenteTitulo": "Wikipedia: La Peña (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Campa de Ibaizabal»?",
    "opts": [
     "La Peña",
     "Albia",
     "San Ignacio",
     "Masustegi"
    ],
    "ans": 0,
    "info": "«Campa de Ibaizabal» pertenece a La Peña.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
    "fuenteTitulo": "Wikipedia: La Peña (Bilbao)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que La Peña?",
    "opts": [
     "San Pedro de Deusto",
     "Olabeaga",
     "Zazpikaleak",
     "San Ignacio"
    ],
    "ans": 2,
    "info": "La Peña y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Arabella",
     "Ciudad Jardín",
     "La Peña",
     "Ribera de Deusto"
    ],
    "ans": 2,
    "info": "La Peña está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene La Peña estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "La Peña no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "La Peña",
     "Santutxu",
     "Indautxu",
     "Abando"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Memoria de la isla de San Cristóbal, desaparecida tras el encauzamiento posterior a 1983»?",
    "opts": [
     "Altamira",
     "Uretamendi",
     "Masustegi",
     "La Peña"
    ],
    "ans": 3,
    "info": "«Memoria de la isla de San Cristóbal, desaparecida tras el encauzamiento posterior a 1983» está en La Peña.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
    "fuenteTitulo": "Wikipedia: La Peña (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Ermita de Nuestra Señora de La Peña de Francia, que da nombre al barrio»?",
    "opts": [
     "Basurtu-Zorrotza",
     "Ibaiondo",
     "Deustu",
     "Begoña"
    ],
    "ans": 1,
    "info": "«Ermita de Nuestra Señora de La Peña de Francia, que da nombre al barrio» está en La Peña, distrito Ibaiondo.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
    "fuenteTitulo": "Wikipedia: La Peña (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra «Parque de Ibaieder, con tirolina y zona de skate»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Ibaiondo",
     "Uribarri",
     "Basurtu-Zorrotza"
    ],
    "ans": 1,
    "info": "«Parque de Ibaieder, con tirolina y zona de skate» está en La Peña, distrito Ibaiondo.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/La_Pe%C3%B1a_(Bilbao)",
    "fuenteTitulo": "Wikipedia: La Peña (Bilbao)"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Abando",
     "Txurdinaga",
     "La Peña",
     "Zorrotza"
    ],
    "ans": 3,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Iturralde",
     "Ametzola",
     "Solokoetxe",
     "La Peña"
    ],
    "ans": 0,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Miribilla",
  "distrito": "Ibaiondo",
  "lema": "La cumbre de hierro y miradores",
  "pintxo": {
   "nombre": "Pintxo de solomillo de Miribilla",
   "ingrediente": "solomillo",
   "color": "#a5d8ff",
   "forma": 4
  },
  "fuentes": [
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://es.wikipedia.org/wiki/Miribilla",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Miribilla?",
    "opts": [
     "Abando",
     "Ibaiondo",
     "Basurtu-Zorrotza",
     "Uribarri"
    ],
    "ans": 1,
    "info": "Miribilla forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Miribilla en el padrón de 2023?",
    "opts": [
     "9043",
     "2469",
     "1812",
     "1685"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 9043 habitantes en Miribilla.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Miribilla?",
    "opts": [
     "12 ha",
     "47 ha",
     "38 ha",
     "15 ha"
    ],
    "ans": 2,
    "info": "Miribilla ocupa aproximadamente 38 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Miribilla?",
    "opts": [
     "93,3 hab/ha",
     "7,5 hab/ha",
     "447,7 hab/ha",
     "238 hab/ha"
    ],
    "ans": 3,
    "info": "La densidad de Miribilla ronda los 238 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Miribilla?",
    "opts": [
     "Solo autobús",
     "Metro · Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Tren · Renfe Cercanías Ametzola",
     "Tren · Renfe Cercanías Miribilla"
    ],
    "ans": 3,
    "info": "Miribilla: Tren · Renfe Cercanías Miribilla. Apeadero de Miribilla (calle Santiago de Compostela)",
    "tipo": "access",
    "fuente": "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
    "fuenteTitulo": "Renfe"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Miribilla?",
    "opts": [
     "Iglesia de Santa María Josefa, del estudio IMB",
     "Vicinay Cadenas y antiguos astilleros de la Ribera",
     "Catedral de Santiago",
     "Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia"
    ],
    "ans": 0,
    "info": "«Iglesia de Santa María Josefa, del estudio IMB» es un hito de Miribilla.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Iglesia de Santa María Josefa, del estudio IMB»?",
    "opts": [
     "Campuzano",
     "Ibarrekolanda",
     "Ribera de Deusto",
     "Miribilla"
    ],
    "ans": 3,
    "info": "«Iglesia de Santa María Josefa, del estudio IMB» está en Miribilla.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Miribilla?",
    "opts": [
     "Jardines de Gernika (bulevar de 30.000 m²)",
     "Campa de Ibaizabal",
     "Plaza Tres Pilares",
     "Entorno del monte Kobetas y Camino Kobetas"
    ],
    "ans": 0,
    "info": "«Jardines de Gernika (bulevar de 30.000 m²)» está en Miribilla.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Jardines de Gernika (bulevar de 30.000 m²)»?",
    "opts": [
     "Txurdinaga",
     "Miribilla",
     "Altamira",
     "Basurto"
    ],
    "ans": 1,
    "info": "«Jardines de Gernika (bulevar de 30.000 m²)» pertenece a Miribilla.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Bilbao Arena / polideportivo de Miribilla»?",
    "opts": [
     "Castaños",
     "San Francisco",
     "Miribilla",
     "Bolueta"
    ],
    "ans": 2,
    "info": "«Bilbao Arena / polideportivo de Miribilla» está en Miribilla.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Miribilla (50.000 m²), atalaya sobre Bilbao»?",
    "opts": [
     "Elorrieta",
     "Iturrigorri - Peñascal",
     "Miribilla",
     "Albia"
    ],
    "ans": 2,
    "info": "«Parque de Miribilla (50.000 m²), atalaya sobre Bilbao» pertenece a Miribilla.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Miribilla?",
    "opts": [
     "Ciudad Jardín",
     "Albia",
     "Zazpikaleak",
     "Uretamendi"
    ],
    "ans": 2,
    "info": "Miribilla y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Zurbaran",
     "Mina del Morro",
     "Abando",
     "Miribilla"
    ],
    "ans": 3,
    "info": "Miribilla está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Miribilla estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Miribilla no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
    "fuenteTitulo": "bilbaogazte.bilbao.eus"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Miribilla",
     "Abando",
     "Santutxu",
     "Indautxu"
    ],
    "ans": 2,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Antiguas minas de hierro sobre las que se levantó el barrio»?",
    "opts": [
     "Basurto",
     "Miribilla",
     "Otxarkoaga",
     "Zorrotzaurre"
    ],
    "ans": 1,
    "info": "«Antiguas minas de hierro sobre las que se levantó el barrio» está en Miribilla.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque Emiliano Arriaga»?",
    "opts": [
     "Otxarkoaga",
     "Iralabarri",
     "Uretamendi",
     "Miribilla"
    ],
    "ans": 3,
    "info": "«Parque Emiliano Arriaga» pertenece a Miribilla.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Iglesia de Santa María Josefa, del estudio IMB»?",
    "opts": [
     "Uribarri",
     "Deustu",
     "Ibaiondo",
     "Abando"
    ],
    "ans": 2,
    "info": "«Iglesia de Santa María Josefa, del estudio IMB» está en Miribilla, distrito Ibaiondo.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿En qué distrito se encuentra «Jardines de Gernika (bulevar de 30.000 m²)»?",
    "opts": [
     "Errekalde",
     "Abando",
     "Basurtu-Zorrotza",
     "Ibaiondo"
    ],
    "ans": 3,
    "info": "«Jardines de Gernika (bulevar de 30.000 m²)» está en Miribilla, distrito Ibaiondo.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Miribilla",
    "fuenteTitulo": "Wikipedia: Miribilla"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Zorrotza",
     "Abando",
     "Txurdinaga",
     "Miribilla"
    ],
    "ans": 0,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "San Adrián",
  "distrito": "Ibaiondo",
  "lema": "Vergel y calma junto al arroyo",
  "pintxo": {
   "nombre": "Pintxo de morcilla dulce de San Adrián",
   "ingrediente": "morcilla dulce",
   "color": "#e7c15a",
   "forma": 5
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://es.wikipedia.org/wiki/San_Adri%C3%A1n_(Bilbao)",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.periodicoconstruccion.com/2020/10/bilbao-construye-una-cancha-de-baloncesto-en-los-jardines-de-emiliano-arriaga/"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de San Adrián?",
    "opts": [
     "Ibaiondo",
     "Begoña",
     "Otxarkoaga-Txurdinaga",
     "Deustu"
    ],
    "ans": 0,
    "info": "San Adrián forma parte del distrito Ibaiondo.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía San Adrián en el padrón de 2023?",
    "opts": [
     "5454",
     "1685",
     "3257",
     "12.304"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 5454 habitantes en San Adrián.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene San Adrián?",
    "opts": [
     "81 ha",
     "25 ha",
     "129 ha",
     "97 ha"
    ],
    "ans": 1,
    "info": "San Adrián ocupa aproximadamente 25 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de San Adrián?",
    "opts": [
     "185,3 hab/ha",
     "85,3 hab/ha",
     "218,2 hab/ha",
     "156,8 hab/ha"
    ],
    "ans": 2,
    "info": "La densidad de San Adrián ronda los 218,2 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de San Adrián?",
    "opts": [
     "Metro · Abando (L1/L2)",
     "Solo autobús",
     "Tranvía · T1 Abusu",
     "Metro · Txurdinaga (L3)"
    ],
    "ans": 1,
    "info": "San Adrián: Solo autobús. Solo autobús",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de San Adrián?",
    "opts": [
     "Estación de Zabálburu (C-1/C-2)",
     "Jardines Emiliano Arriaga como espacio deportivo de referencia",
     "Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia",
     "Albergue municipal de Bilbao, a los pies del barrio"
    ],
    "ans": 1,
    "info": "«Jardines Emiliano Arriaga como espacio deportivo de referencia» es un hito de San Adrián.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/San_Adri%C3%A1n_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Adrián (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Jardines Emiliano Arriaga como espacio deportivo de referencia»?",
    "opts": [
     "Arabella",
     "Ametzola",
     "Zazpikaleak",
     "San Adrián"
    ],
    "ans": 3,
    "info": "«Jardines Emiliano Arriaga como espacio deportivo de referencia» está en San Adrián.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Adri%C3%A1n_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Adrián (Bilbao)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a San Adrián?",
    "opts": [
     "Jardines Emiliano Arriaga, con cancha de baloncesto",
     "Ribera del Cadagua",
     "Pistas de skate y roller del Parque Europa",
     "Parque de Eskurtze, con skate y bolera"
    ],
    "ans": 0,
    "info": "«Jardines Emiliano Arriaga, con cancha de baloncesto» está en San Adrián.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/San_Adri%C3%A1n_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Adrián (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Jardines Emiliano Arriaga, con cancha de baloncesto»?",
    "opts": [
     "San Adrián",
     "Zorrotzaurre",
     "Errekaldeberri",
     "Ibarrekolanda"
    ],
    "ans": 0,
    "info": "«Jardines Emiliano Arriaga, con cancha de baloncesto» pertenece a San Adrián.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Adri%C3%A1n_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Adrián (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Jardines de La Floresta»?",
    "opts": [
     "Campuzano",
     "Gurtubay",
     "Castaños",
     "San Adrián"
    ],
    "ans": 3,
    "info": "«Jardines de La Floresta» pertenece a San Adrián.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Adri%C3%A1n_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Adrián (Bilbao)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que San Adrián?",
    "opts": [
     "Abando",
     "Zorrotzaurre",
     "Zazpikaleak",
     "Zurbaran"
    ],
    "ans": 2,
    "info": "San Adrián y Zazpikaleak están en el distrito Ibaiondo.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Ibaiondo?",
    "opts": [
     "Betolaza",
     "San Adrián",
     "San Pedro de Deusto",
     "Campuzano"
    ],
    "ans": 1,
    "info": "San Adrián está en el distrito Ibaiondo.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene San Adrián estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "San Adrián no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "San Adrián",
     "Abando",
     "Santutxu"
    ],
    "ans": 3,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Jardines Emiliano Arriaga como espacio deportivo de referencia»?",
    "opts": [
     "Ibaiondo",
     "Basurtu-Zorrotza",
     "Uribarri",
     "Errekalde"
    ],
    "ans": 0,
    "info": "«Jardines Emiliano Arriaga como espacio deportivo de referencia» está en San Adrián, distrito Ibaiondo.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/San_Adri%C3%A1n_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Adrián (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra «Jardines Emiliano Arriaga, con cancha de baloncesto»?",
    "opts": [
     "Ibaiondo",
     "Abando",
     "Otxarkoaga-Txurdinaga",
     "Basurtu-Zorrotza"
    ],
    "ans": 0,
    "info": "«Jardines Emiliano Arriaga, con cancha de baloncesto» está en San Adrián, distrito Ibaiondo.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/San_Adri%C3%A1n_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Adrián (Bilbao)"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Txurdinaga",
     "Abando",
     "Zorrotza",
     "San Adrián"
    ],
    "ans": 2,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Ametzola",
     "Iturralde",
     "Solokoetxe",
     "San Adrián"
    ],
    "ans": 1,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Ibaiondo?",
    "opts": [
     "Iturralde",
     "Atxuri",
     "San Pedro de Deusto",
     "Casco Viejo"
    ],
    "ans": 2,
    "info": "San Pedro de Deusto no está en Ibaiondo.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_5.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Jardines Emiliano Arriaga como espacio deportivo de referencia» está en San Adrián?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en San Adrián.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/San_Adri%C3%A1n_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Adrián (Bilbao)"
   }
  ]
 },
 {
  "nombre": "Mina del Morro",
  "distrito": "Begoña",
  "lema": "Ecos subterráneos de mineros",
  "pintxo": {
   "nombre": "Pintxo de pimiento asado de Mina del Morro",
   "ingrediente": "pimiento asado",
   "color": "#e08a4a",
   "forma": 0
  },
  "fuentes": [
   "https://www.bizkaia.eus/documents/26740887/27190404/industry-and-heritage-01.pdf",
   "https://bilbaogazte.bilbao.eus/wp-content/uploads/2016/06/montes_distrito4.pdf",
   "https://es.wikipedia.org/wiki/Bego%C3%B1a",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Mina del Morro?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Basurtu-Zorrotza",
     "Ibaiondo",
     "Begoña"
    ],
    "ans": 3,
    "info": "Mina del Morro forma parte del distrito Begoña.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Mina del Morro?",
    "opts": [
     "Metro · Uribarri (L3)",
     "Metro · Santutxu (L1/L2)",
     "Metro · Otxarkoaga (L3)",
     "Solo autobús"
    ],
    "ans": 3,
    "info": "Mina del Morro: Solo autobús. Solo autobús",
    "tipo": "access",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Mina del Morro?",
    "opts": [
     "Memoria de la cantera de la mina 'Rosita' (catástrofe de 1899)",
     "Memoria del antiguo barrio y caseríos de Goiri y del convento de Capuchinos (s. XVIII)",
     "Antiguo coto minero de El Morro, activo hasta 1970",
     "Teatro Arriaga (1890, Joaquín Rucoba)"
    ],
    "ans": 2,
    "info": "«Antiguo coto minero de El Morro, activo hasta 1970» es un hito de Mina del Morro. El coto minero de El Morro formó parte de la explotación histórica de hierro de la zona y se mantuvo activo hasta alrededor de 1970.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Antiguo coto minero de El Morro, activo hasta 1970»?",
    "opts": [
     "Mina del Morro",
     "Campuzano",
     "San Mamés",
     "Uretamendi"
    ],
    "ans": 0,
    "info": "«Antiguo coto minero de El Morro, activo hasta 1970» está en Mina del Morro. El coto minero de El Morro formó parte de la explotación histórica de hierro de la zona y se mantuvo activo hasta alrededor de 1970.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Mina del Morro?",
    "opts": [
     "Fuente de los Jardines de Albia",
     "Parque de Mina del Morro",
     "Plaza de Martzana",
     "Plaza de Garellano"
    ],
    "ans": 1,
    "info": "«Parque de Mina del Morro» está en Mina del Morro.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Mina del Morro»?",
    "opts": [
     "Mina del Morro",
     "Arangoiti",
     "Zazpikaleak",
     "Olabeaga"
    ],
    "ans": 0,
    "info": "«Parque de Mina del Morro» pertenece a Mina del Morro.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Galerías y restos de la minería del hierro»?",
    "opts": [
     "Solokoetxe",
     "Mina del Morro",
     "Abando",
     "Ribera de Deusto"
    ],
    "ans": 1,
    "info": "«Galerías y restos de la minería del hierro» está en Mina del Morro.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Ladera verde de Santutxu»?",
    "opts": [
     "Begoña",
     "Uribarri",
     "Elorrieta",
     "Mina del Morro"
    ],
    "ans": 3,
    "info": "«Ladera verde de Santutxu» pertenece a Mina del Morro.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Mina del Morro?",
    "opts": [
     "Larraskitu",
     "Begoña",
     "San Adrián",
     "Iturrigorri - Peñascal"
    ],
    "ans": 1,
    "info": "Mina del Morro y Begoña están en el distrito Begoña.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Begoña?",
    "opts": [
     "Iturrigorri - Peñascal",
     "Ibarrekolanda",
     "San Adrián",
     "Mina del Morro"
    ],
    "ans": 3,
    "info": "Mina del Morro está en el distrito Begoña.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Mina del Morro estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Mina del Morro no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Parque de Mina del Morro, en la ladera de Santutxu»?",
    "opts": [
     "Elorrieta",
     "Basurto",
     "San Francisco",
     "Mina del Morro"
    ],
    "ans": 3,
    "info": "«Parque de Mina del Morro, en la ladera de Santutxu» está en Mina del Morro.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Antiguo coto minero de El Morro, activo hasta 1970»?",
    "opts": [
     "Deustu",
     "Begoña",
     "Uribarri",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 1,
    "info": "«Antiguo coto minero de El Morro, activo hasta 1970» está en Mina del Morro, distrito Begoña. El coto minero de El Morro formó parte de la explotación histórica de hierro de la zona y se mantuvo activo hasta alrededor de 1970.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿En qué distrito se encuentra «Parque de Mina del Morro»?",
    "opts": [
     "Begoña",
     "Errekalde",
     "Deustu",
     "Uribarri"
    ],
    "ans": 0,
    "info": "«Parque de Mina del Morro» está en Mina del Morro, distrito Begoña.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Begoña?",
    "opts": [
     "San Pedro de Deusto",
     "Begoña",
     "Bolueta",
     "Santutxu"
    ],
    "ans": 0,
    "info": "San Pedro de Deusto no está en Begoña.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Antiguo coto minero de El Morro, activo hasta 1970» está en Mina del Morro?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Mina del Morro. El coto minero de El Morro formó parte de la explotación histórica de hierro de la zona y se mantuvo activo hasta alrededor de 1970.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Mina del Morro?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, ese hito no está en Mina del Morro.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿El espacio «Parque de Mina del Morro» está en Mina del Morro?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Mina del Morro.",
    "tipo": "tfEspacioYes",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿El espacio «Plaza de San Pedro» está en Mina del Morro?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, ese espacio no está en Mina del Morro.",
    "tipo": "tfEspacioNo",
    "fuente": "https://es.wikipedia.org/wiki/Bego%C3%B1a",
    "fuenteTitulo": "Wikipedia: Begoña"
   },
   {
    "q": "¿El barrio de Mina del Morro está en el distrito Begoña?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, pertenece a Begoña.",
    "tipo": "districtTF",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_4.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Abando",
  "distrito": "Abando",
  "lema": "El corazón dorado de Bilbao",
  "pintxo": {
   "nombre": "Pintxo de caviar de Abando",
   "ingrediente": "caviar",
   "color": "#ffd166",
   "forma": 1
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://es.wikipedia.org/wiki/Abando_(barrio)",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.euskotren.eus/sites/default/files/horarios/tranvia%20bilbao_horizontal-A3-%20Verano%202025_0.pdf"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Abando?",
    "opts": [
     "Uribarri",
     "Otxarkoaga-Txurdinaga",
     "Abando",
     "Ibaiondo"
    ],
    "ans": 2,
    "info": "Abando forma parte del distrito Abando.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Abando en el padrón de 2023?",
    "opts": [
     "24.135",
     "452",
     "171",
     "7370"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 24.135 habitantes en Abando.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Abando?",
    "opts": [
     "47 ha",
     "60,1 ha",
     "11 ha",
     "117 ha"
    ],
    "ans": 3,
    "info": "Abando ocupa aproximadamente 117 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Abando?",
    "opts": [
     "120,8 hab/ha",
     "206,3 hab/ha",
     "143,7 hab/ha",
     "123,5 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Abando ronda los 206,3 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Abando?",
    "opts": [
     "Basarrate (L1/L2)",
     "San Inazio (L1/L2)",
     "Abando (L1/L2)",
     "Indautxu (L1/L2)"
    ],
    "ans": 2,
    "info": "La estación de metro más próxima es Abando (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Abando?",
    "opts": [
     "Metro · Abando (L1/L2)",
     "Tren · Renfe Cercanías Olabeaga",
     "Tranvía · T1 Abusu",
     "Metro · Santutxu (L1/L2)"
    ],
    "ans": 0,
    "info": "Abando: Metro · Abando (L1/L2). Principal nodo intermodal de la ciudad",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Abando?",
    "opts": [
     "Parada de tranvía Bolueta (2022), en el antiguo apeadero de Euskotren",
     "Campa de Basarrate como plaza mayor del barrio",
     "Museo Guggenheim Bilbao",
     "Museo del Pan"
    ],
    "ans": 2,
    "info": "«Museo Guggenheim Bilbao» es un hito de Abando.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Abando_(barrio)",
    "fuenteTitulo": "Wikipedia: Abando (barrio)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Museo Guggenheim Bilbao»?",
    "opts": [
     "Abando",
     "Txurdinaga",
     "La Peña",
     "Uretamendi"
    ],
    "ans": 0,
    "info": "«Museo Guggenheim Bilbao» está en Abando.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Abando_(barrio)",
    "fuenteTitulo": "Wikipedia: Abando (barrio)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Abando?",
    "opts": [
     "Calzada medieval de Kastrexana",
     "Jardines de Albia",
     "Plaza de la Cantera",
     "Plaza Sarrikoalde"
    ],
    "ans": 1,
    "info": "«Jardines de Albia» está en Abando.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Abando_(barrio)",
    "fuenteTitulo": "Wikipedia: Abando (barrio)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Circular / Plaza Biribila»?",
    "opts": [
     "Castaños",
     "Solokoetxe",
     "Betolaza",
     "Abando"
    ],
    "ans": 3,
    "info": "«Plaza Circular / Plaza Biribila» pertenece a Abando.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Abando_(barrio)",
    "fuenteTitulo": "Wikipedia: Abando (barrio)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Torre Iberdrola, Torre Bizkaia y torres Isozaki Atea»?",
    "opts": [
     "Indautxu",
     "Zorrotzaurre",
     "Abando",
     "La Peña"
    ],
    "ans": 2,
    "info": "«Torre Iberdrola, Torre Bizkaia y torres Isozaki Atea» está en Abando.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Abando_(barrio)",
    "fuenteTitulo": "Wikipedia: Abando (barrio)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Elíptica (Moyúa)»?",
    "opts": [
     "Elorrieta",
     "San Adrián",
     "Zabala",
     "Abando"
    ],
    "ans": 3,
    "info": "«Plaza Elíptica (Moyúa)» pertenece a Abando.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Abando_(barrio)",
    "fuenteTitulo": "Wikipedia: Abando (barrio)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Abando?",
    "opts": [
     "Ribera de Deusto",
     "Indautxu",
     "Masustegi",
     "Arabella"
    ],
    "ans": 1,
    "info": "Abando y Indautxu están en el distrito Abando.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Abando?",
    "opts": [
     "Atxuri",
     "Elorrieta",
     "Abando",
     "Ciudad Jardín"
    ],
    "ans": 2,
    "info": "Abando está en el distrito Abando.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Abando estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: Abando (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Abando (L1/L2) da servicio a Abando?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Abando (L1/L2) es la estación de metro de Abando.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Abando?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Abando.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Abando",
     "Santutxu",
     "Indautxu",
     "San Pedro de Deusto"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de Abando Indalecio Prieto»?",
    "opts": [
     "Abando",
     "Guggenheim - Ensanche",
     "Elorrieta",
     "Bilbao La Vieja"
    ],
    "ans": 0,
    "info": "«Estación de Abando Indalecio Prieto» está en Abando.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Abando_(barrio)",
    "fuenteTitulo": "Wikipedia: Abando (barrio)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de la República de Abando»?",
    "opts": [
     "Iturralde",
     "Abando",
     "Iralabarri",
     "San Francisco"
    ],
    "ans": 1,
    "info": "«Parque de la República de Abando» pertenece a Abando.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Abando_(barrio)",
    "fuenteTitulo": "Wikipedia: Abando (barrio)"
   }
  ]
 },
 {
  "nombre": "Indautxu",
  "distrito": "Abando",
  "lema": "Elegancia, terrazas y bullicio",
  "pintxo": {
   "nombre": "Pintxo de foie de Indautxu",
   "ingrediente": "foie",
   "color": "#ffd166",
   "forma": 2
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://es.wikipedia.org/wiki/Indauchu",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.euskotren.eus/es/tranvia/bilbao"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Indautxu?",
    "opts": [
     "Abando",
     "Basurtu-Zorrotza",
     "Begoña",
     "Ibaiondo"
    ],
    "ans": 0,
    "info": "Indautxu forma parte del distrito Abando.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Indautxu en el padrón de 2023?",
    "opts": [
     "27.039",
     "5491",
     "3257",
     "12.691"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 27.039 habitantes en Indautxu.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Indautxu?",
    "opts": [
     "40 ha",
     "97 ha",
     "129 ha",
     "13 ha"
    ],
    "ans": 1,
    "info": "Indautxu ocupa aproximadamente 97 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Indautxu?",
    "opts": [
     "403 hab/ha",
     "278,8 hab/ha",
     "71,3 hab/ha",
     "93,3 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Indautxu ronda los 278,8 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Indautxu?",
    "opts": [
     "Abando (L1/L2)",
     "Uribarri (L3)",
     "Basarrate (L1/L2)",
     "Indautxu (L1/L2)"
    ],
    "ans": 3,
    "info": "La estación de metro más próxima es Indautxu (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Indautxu?",
    "opts": [
     "Tren (FEVE) y autobús",
     "Tren · Renfe Cercanías Ametzola",
     "Metro · Indautxu (L1/L2)",
     "Tranvía · T1 Atxuri"
    ],
    "ans": 2,
    "info": "Indautxu: Metro · Indautxu (L1/L2). Metro bajo la plaza de Indautxu; apeadero de Autonomía en María Díaz de Haro",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Indautxu?",
    "opts": [
     "Museo de Bellas Artes de Bilbao, en el parque de Doña Casilda",
     "Iglesia de Santa María Josefa, del estudio IMB",
     "Mercado San Inazio-Ibarrekolanda",
     "Universidad Popular y biblioteca de Errekalde"
    ],
    "ans": 0,
    "info": "«Museo de Bellas Artes de Bilbao, en el parque de Doña Casilda» es un hito de Indautxu.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Indauchu",
    "fuenteTitulo": "Wikipedia: Indauchu"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Museo de Bellas Artes de Bilbao, en el parque de Doña Casilda»?",
    "opts": [
     "Uretamendi",
     "San Pedro de Deusto",
     "Ibarrekolanda",
     "Indautxu"
    ],
    "ans": 3,
    "info": "«Museo de Bellas Artes de Bilbao, en el parque de Doña Casilda» está en Indautxu.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Indauchu",
    "fuenteTitulo": "Wikipedia: Indauchu"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Indautxu?",
    "opts": [
     "Parque de Eskurtze, con skate y bolera",
     "Plaza de Basurtugorta",
     "Plaza de Indautxu",
     "Entorno del Puente del Diablo"
    ],
    "ans": 2,
    "info": "«Plaza de Indautxu» está en Indautxu.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Indauchu",
    "fuenteTitulo": "Wikipedia: Indauchu"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Indautxu»?",
    "opts": [
     "Zorrotza",
     "Olabeaga",
     "Ametzola",
     "Indautxu"
    ],
    "ans": 3,
    "info": "«Plaza de Indautxu» pertenece a Indautxu.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Indauchu",
    "fuenteTitulo": "Wikipedia: Indauchu"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación y centro comercial bajo la plaza de Indautxu»?",
    "opts": [
     "Elorrieta",
     "Mina del Morro",
     "Santutxu",
     "Indautxu"
    ],
    "ans": 3,
    "info": "«Estación y centro comercial bajo la plaza de Indautxu» está en Indautxu.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Indauchu",
    "fuenteTitulo": "Wikipedia: Indauchu"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Doña Casilda Iturrizar»?",
    "opts": [
     "San Mamés",
     "Zabala",
     "Uribarri",
     "Indautxu"
    ],
    "ans": 3,
    "info": "«Parque de Doña Casilda Iturrizar» pertenece a Indautxu.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Indauchu",
    "fuenteTitulo": "Wikipedia: Indauchu"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Indautxu?",
    "opts": [
     "Ibarrekolanda",
     "Abando",
     "Larraskitu",
     "Mina del Morro"
    ],
    "ans": 1,
    "info": "Indautxu y Abando están en el distrito Abando.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Abando?",
    "opts": [
     "Indautxu",
     "Basurto",
     "Arangoiti",
     "Masustegi"
    ],
    "ans": 0,
    "info": "Indautxu está en el distrito Abando.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Indautxu estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: Indautxu (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Indautxu (L1/L2) da servicio a Indautxu?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Indautxu (L1/L2) es la estación de metro de Indautxu.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Indautxu?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Indautxu.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Santutxu",
     "Abando",
     "San Pedro de Deusto"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Colegio de los jesuitas»?",
    "opts": [
     "Elorrieta",
     "San Adrián",
     "Indautxu",
     "Kastrexana"
    ],
    "ans": 2,
    "info": "«Colegio de los jesuitas» está en Indautxu.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Indauchu",
    "fuenteTitulo": "Wikipedia: Indauchu"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Bizkaia y plaza Chillida»?",
    "opts": [
     "Uretamendi",
     "Arabella",
     "Guggenheim - Ensanche",
     "Indautxu"
    ],
    "ans": 3,
    "info": "«Plaza Bizkaia y plaza Chillida» pertenece a Indautxu.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Indauchu",
    "fuenteTitulo": "Wikipedia: Indauchu"
   }
  ]
 },
 {
  "nombre": "Albia",
  "distrito": "Abando",
  "lema": "Jardines de sombra y pláticas sabias",
  "pintxo": {
   "nombre": "Pintxo de setas de Albia",
   "ingrediente": "setas",
   "color": "#f0d27a",
   "forma": 3
  },
  "fuentes": [
   "https://es.wikipedia.org/wiki/Jardines_de_Albia",
   "https://www.bilbaoturismo.net/BilbaoTurismo/es/arquitectura/el-ensanche",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.bizkaia.eus/Home2/Archivos/DPTO4/Temas/Patrimonio_Cultural/publicaciones/pdf/Ensanches.pdf",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Albia?",
    "opts": [
     "Basurtu-Zorrotza",
     "Errekalde",
     "Deustu",
     "Abando"
    ],
    "ans": 3,
    "info": "Albia forma parte del distrito Abando.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Albia?",
    "opts": [
     "Abando (L1/L2)",
     "Txurdinaga (L3)",
     "Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Otxarkoaga (L3)"
    ],
    "ans": 0,
    "info": "La estación de metro más próxima es Abando (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Albia?",
    "opts": [
     "Metro · Sarriko (L1/L2)",
     "Metro · Txurdinaga (L3)",
     "Metro · San Inazio (L1/L2)",
     "Metro (Abando y Moyua)"
    ],
    "ans": 3,
    "info": "Albia: Metro (Abando y Moyua). Metro, tranvía y tren de cercanías",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Albia?",
    "opts": [
     "Calle Zabalbide, la más larga y alta de Bilbao",
     "Jardines de Albia, en el Ensanche",
     "Santa Ana de Bolueta, primera planta moderna de transformación de acero de Bizkaia (1840)",
     "Restaurante El Amparo, antiguo caserío"
    ],
    "ans": 1,
    "info": "«Jardines de Albia, en el Ensanche» es un hito de Albia.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Jardines de Albia, en el Ensanche»?",
    "opts": [
     "Albia",
     "Arangoiti",
     "Ibarrekolanda",
     "Arabella"
    ],
    "ans": 0,
    "info": "«Jardines de Albia, en el Ensanche» está en Albia.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Albia?",
    "opts": [
     "Área deportiva de la plaza de Rekalde",
     "Mirador de Uretamendi",
     "Entorno de la calle Gurtubay",
     "Jardines de Albia"
    ],
    "ans": 3,
    "info": "«Jardines de Albia» está en Albia.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Fuente de los Jardines de Albia»?",
    "opts": [
     "Kastrexana",
     "Betolaza",
     "Albia",
     "Elorrieta"
    ],
    "ans": 2,
    "info": "«Fuente de los Jardines de Albia» pertenece a Albia.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estatua de Antonio Trueba en los jardines»?",
    "opts": [
     "Indautxu",
     "La Peña",
     "Begoña",
     "Albia"
    ],
    "ans": 3,
    "info": "«Estatua de Antonio Trueba en los jardines» está en Albia.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de San Vicente»?",
    "opts": [
     "San Mamés",
     "Castaños",
     "Albia",
     "Zorrotza"
    ],
    "ans": 2,
    "info": "«Plaza de San Vicente» pertenece a Albia.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Albia?",
    "opts": [
     "Kastrexana",
     "Iturrigorri - Peñascal",
     "Abando",
     "Gurtubay"
    ],
    "ans": 2,
    "info": "Albia y Abando están en el distrito Abando.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Abando?",
    "opts": [
     "San Adrián",
     "San Mamés",
     "Arangoiti",
     "Albia"
    ],
    "ans": 3,
    "info": "Albia está en el distrito Abando.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Albia estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Abando (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Abando (L1/L2) da servicio a Albia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, Abando (L1/L2) es la estación de metro de Albia.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Albia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, Deustu (L1/L2) no es la estación de Albia.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Fuente de los Jardines de Albia»?",
    "opts": [
     "Betolaza",
     "Ametzola",
     "Artxanda",
     "Albia"
    ],
    "ans": 3,
    "info": "«Fuente de los Jardines de Albia» está en Albia.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Jardines de Albia, en el Ensanche»?",
    "opts": [
     "Ibaiondo",
     "Begoña",
     "Abando",
     "Uribarri"
    ],
    "ans": 2,
    "info": "«Jardines de Albia, en el Ensanche» está en Albia, distrito Abando.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   },
   {
    "q": "¿En qué distrito se encuentra «Fuente de los Jardines de Albia»?",
    "opts": [
     "Errekalde",
     "Deustu",
     "Abando",
     "Uribarri"
    ],
    "ans": 2,
    "info": "«Fuente de los Jardines de Albia» está en Albia, distrito Abando.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Abando?",
    "opts": [
     "Abando",
     "Campuzano",
     "San Pedro de Deusto",
     "Indautxu"
    ],
    "ans": 2,
    "info": "San Pedro de Deusto no está en Abando.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Albia parada de tranvía?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Albia cuenta con parada de tranvía.",
    "tipo": "tranviaTF",
    "fuente": "https://www.euskotren.eus/es/tranvia/bilbao",
    "fuenteTitulo": "Euskotren"
   },
   {
    "q": "¿El hito «Jardines de Albia, en el Ensanche» está en Albia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Albia.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Jardines_de_Albia",
    "fuenteTitulo": "Wikipedia: Jardines de Albia"
   }
  ]
 },
 {
  "nombre": "Guggenheim - Ensanche",
  "distrito": "Abando",
  "lema": "Titanio brillante junto al agua",
  "pintxo": {
   "nombre": "Pintxo de txangurro de Guggenheim - Ensanche",
   "ingrediente": "txangurro",
   "color": "#a5d8ff",
   "forma": 4
  },
  "fuentes": [
   "https://www.guggenheim-bilbao.eus/",
   "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
   "https://es.wikipedia.org/wiki/Abando_(barrio)",
   "https://www.bilbaoturismo.net/BilbaoTurismo/es/que-ver/museo-guggenheim-bilbao",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Guggenheim - Ensanche?",
    "opts": [
     "Abando",
     "Begoña",
     "Otxarkoaga-Txurdinaga",
     "Uribarri"
    ],
    "ans": 0,
    "info": "Guggenheim - Ensanche forma parte del distrito Abando.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Guggenheim - Ensanche?",
    "opts": [
     "Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Santimami/San Mamés (L1/L2)",
     "Moyua (L1/L2)",
     "Deustu (L1/L2)"
    ],
    "ans": 2,
    "info": "La estación de metro más próxima es Moyua (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Guggenheim - Ensanche?",
    "opts": [
     "Tren (FEVE) y autobús",
     "Metro · Santimami/San Mamés (L1/L2)",
     "Metro (Moyua y Abando)",
     "Tren · Renfe Cercanías Olabeaga"
    ],
    "ans": 2,
    "info": "Guggenheim - Ensanche: Metro (Moyua y Abando). Metro, tranvía y tren",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Guggenheim - Ensanche?",
    "opts": [
     "Escuelas de Tomás Camacho (1921, Pedro Ispizua)",
     "Mercado municipal de Otxarkoaga",
     "Iglesia de San Gabriel, patrón de las fiestas del barrio",
     "Museo Guggenheim, obra de Frank Gehry inaugurada en 1997"
    ],
    "ans": 3,
    "info": "«Museo Guggenheim, obra de Frank Gehry inaugurada en 1997» es un hito de Guggenheim - Ensanche.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Museo Guggenheim, obra de Frank Gehry inaugurada en 1997»?",
    "opts": [
     "Abando",
     "Guggenheim - Ensanche",
     "Matiko",
     "Indautxu"
    ],
    "ans": 1,
    "info": "«Museo Guggenheim, obra de Frank Gehry inaugurada en 1997» está en Guggenheim - Ensanche.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Guggenheim - Ensanche?",
    "opts": [
     "Parque de Mina del Morro",
     "Plaza de La Casilla",
     "Parque de Doña Casilda",
     "Plaza de Martzana"
    ],
    "ans": 2,
    "info": "«Parque de Doña Casilda» está en Guggenheim - Ensanche.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Doña Casilda»?",
    "opts": [
     "Guggenheim - Ensanche",
     "Miribilla",
     "Zorrotza",
     "Matiko"
    ],
    "ans": 0,
    "info": "«Parque de Doña Casilda» pertenece a Guggenheim - Ensanche.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Palacio Euskalduna»?",
    "opts": [
     "Bilbao La Vieja",
     "Zazpikaleak",
     "Guggenheim - Ensanche",
     "Ribera de Deusto"
    ],
    "ans": 2,
    "info": "«Palacio Euskalduna» está en Guggenheim - Ensanche.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Paseo de Abandoibarra»?",
    "opts": [
     "Guggenheim - Ensanche",
     "Txurdinaga",
     "Begoña",
     "Basurto"
    ],
    "ans": 0,
    "info": "«Paseo de Abandoibarra» pertenece a Guggenheim - Ensanche.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Guggenheim - Ensanche?",
    "opts": [
     "Ibarrekolanda",
     "San Mamés",
     "Abando",
     "Arangoiti"
    ],
    "ans": 2,
    "info": "Guggenheim - Ensanche y Abando están en el distrito Abando.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Abando?",
    "opts": [
     "Basurto",
     "Guggenheim - Ensanche",
     "Gurtubay",
     "Kastrexana"
    ],
    "ans": 1,
    "info": "Guggenheim - Ensanche está en el distrito Abando.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Guggenheim - Ensanche estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Moyua (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Moyua (L1/L2) da servicio a Guggenheim - Ensanche?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Moyua (L1/L2) es la estación de metro de Guggenheim - Ensanche.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Guggenheim - Ensanche?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Guggenheim - Ensanche.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Museo de Bellas Artes de Bilbao»?",
    "opts": [
     "Kastrexana",
     "San Adrián",
     "Guggenheim - Ensanche",
     "Zurbaran"
    ],
    "ans": 2,
    "info": "«Museo de Bellas Artes de Bilbao» está en Guggenheim - Ensanche.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Explanada del Guggenheim»?",
    "opts": [
     "Olabeaga",
     "Otxarkoaga",
     "Guggenheim - Ensanche",
     "La Peña"
    ],
    "ans": 2,
    "info": "«Explanada del Guggenheim» pertenece a Guggenheim - Ensanche.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Museo Guggenheim, obra de Frank Gehry inaugurada en 1997»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Abando",
     "Deustu",
     "Basurtu-Zorrotza"
    ],
    "ans": 1,
    "info": "«Museo Guggenheim, obra de Frank Gehry inaugurada en 1997» está en Guggenheim - Ensanche, distrito Abando.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿En qué distrito se encuentra «Parque de Doña Casilda»?",
    "opts": [
     "Uribarri",
     "Abando",
     "Ibaiondo",
     "Errekalde"
    ],
    "ans": 1,
    "info": "«Parque de Doña Casilda» está en Guggenheim - Ensanche, distrito Abando.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Museo_Guggenheim_Bilbao",
    "fuenteTitulo": "Wikipedia: Museo Guggenheim Bilbao"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Abando?",
    "opts": [
     "San Pedro de Deusto",
     "Albia",
     "Indautxu",
     "Abando"
    ],
    "ans": 0,
    "info": "San Pedro de Deusto no está en Abando.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Guggenheim - Ensanche parada de tranvía?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Guggenheim - Ensanche cuenta con parada de tranvía.",
    "tipo": "tranviaTF",
    "fuente": "https://www.euskotren.eus/es/tranvia/bilbao",
    "fuenteTitulo": "Euskotren"
   }
  ]
 },
 {
  "nombre": "Campuzano",
  "distrito": "Abando",
  "lema": "Fuente serena del buen compás",
  "pintxo": {
   "nombre": "Pintxo de anchoa del Cantábrico de Campuzano",
   "ingrediente": "anchoa del Cantábrico",
   "color": "#ffd166",
   "forma": 5
  },
  "fuentes": [
   "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Campuzano?",
    "opts": [
     "Abando",
     "Otxarkoaga-Txurdinaga",
     "Ibaiondo",
     "Deustu"
    ],
    "ans": 0,
    "info": "Campuzano forma parte del distrito Abando.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Campuzano?",
    "opts": [
     "Indautxu (L1/L2)",
     "Bolueta (L1/L2)",
     "San Inazio (L1/L2)",
     "Zurbaranbarri (L3)"
    ],
    "ans": 0,
    "info": "La estación de metro más próxima es Indautxu (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Campuzano?",
    "opts": [
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)",
     "Metro · Santimami/San Mamés (L1/L2)",
     "Metro (Moyua y Abando)",
     "Metro (Indautxu)"
    ],
    "ans": 3,
    "info": "Campuzano: Metro (Indautxu). Metro L1 y L2 en Indautxu",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Campuzano?",
    "opts": [
     "Plaza proyectada en 1930 en honor a Emilio Campuzano",
     "Memoria del convento de San Francisco (bula de 1475), que da nombre al barrio",
     "Poblado Dirigido de Otxarkoaga, construido en los años 60 para erradicar el chabolismo",
     "Iglesia de Nuestra Señora de Belén"
    ],
    "ans": 0,
    "info": "«Plaza proyectada en 1930 en honor a Emilio Campuzano» es un hito de Campuzano.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Plaza proyectada en 1930 en honor a Emilio Campuzano»?",
    "opts": [
     "Iralabarri",
     "Matiko",
     "Elorrieta",
     "Campuzano"
    ],
    "ans": 3,
    "info": "«Plaza proyectada en 1930 en honor a Emilio Campuzano» está en Campuzano.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Campuzano?",
    "opts": [
     "Plaza de Ametzola",
     "Plaza de Emilio Campuzano",
     "Punta de Zorrotzaurre",
     "Calles particulares ajardinadas de la cooperativa"
    ],
    "ans": 1,
    "info": "«Plaza de Emilio Campuzano» está en Campuzano.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Emilio Campuzano»?",
    "opts": [
     "Artxanda",
     "Campuzano",
     "Masustegi",
     "Santutxu"
    ],
    "ans": 1,
    "info": "«Plaza de Emilio Campuzano» pertenece a Campuzano.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Fuente central diseñada por Germán Aguirre»?",
    "opts": [
     "Larraskitu",
     "Campuzano",
     "Uribarri",
     "Uretamendi"
    ],
    "ans": 1,
    "info": "«Fuente central diseñada por Germán Aguirre» está en Campuzano.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Campuzano?",
    "opts": [
     "San Mamés",
     "Abando",
     "Zorrotzaurre",
     "Txurdinaga"
    ],
    "ans": 1,
    "info": "Campuzano y Abando están en el distrito Abando.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Abando?",
    "opts": [
     "Campuzano",
     "Uretamendi",
     "Atxuri",
     "Ibarrekolanda"
    ],
    "ans": 0,
    "info": "Campuzano está en el distrito Abando.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Campuzano estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: Indautxu (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Indautxu (L1/L2) da servicio a Campuzano?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, Indautxu (L1/L2) es la estación de metro de Campuzano.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Campuzano?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, Deustu (L1/L2) no es la estación de Campuzano.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Reforma de la plaza en 2006»?",
    "opts": [
     "Abando",
     "Campuzano",
     "Errekaldeberri",
     "Santutxu"
    ],
    "ans": 1,
    "info": "«Reforma de la plaza en 2006» está en Campuzano.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Plaza proyectada en 1930 en honor a Emilio Campuzano»?",
    "opts": [
     "Deustu",
     "Basurtu-Zorrotza",
     "Abando",
     "Begoña"
    ],
    "ans": 2,
    "info": "«Plaza proyectada en 1930 en honor a Emilio Campuzano» está en Campuzano, distrito Abando.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de Emilio Campuzano»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Abando",
     "Basurtu-Zorrotza",
     "Uribarri"
    ],
    "ans": 1,
    "info": "«Plaza de Emilio Campuzano» está en Campuzano, distrito Abando.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Abando?",
    "opts": [
     "San Pedro de Deusto",
     "Albia",
     "Abando",
     "Indautxu"
    ],
    "ans": 0,
    "info": "San Pedro de Deusto no está en Abando.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_6.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Plaza proyectada en 1930 en honor a Emilio Campuzano» está en Campuzano?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Campuzano.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Campuzano?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese hito no está en Campuzano.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   },
   {
    "q": "¿El espacio «Plaza de Emilio Campuzano» está en Campuzano?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Campuzano.",
    "tipo": "tfEspacioYes",
    "fuente": "https://es.wikipedia.org/wiki/Plaza_Emilio_Campuzano",
    "fuenteTitulo": "Wikipedia: Plaza Emilio Campuzano"
   }
  ]
 },
 {
  "nombre": "Errekaldeberri",
  "distrito": "Errekalde",
  "lema": "Fuerza vecinal y orgullo de barrio",
  "pintxo": {
   "nombre": "Pintxo de tortilla de bacalao de Errekaldeberri",
   "ingrediente": "tortilla de bacalao",
   "color": "#e08a4a",
   "forma": 0
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
   "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Errekaldeberri?",
    "opts": [
     "Begoña",
     "Basurtu-Zorrotza",
     "Errekalde",
     "Uribarri"
    ],
    "ans": 2,
    "info": "Errekaldeberri forma parte del distrito Errekalde.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Errekaldeberri en el padrón de 2023?",
    "opts": [
     "10.999",
     "17.167",
     "1273",
     "590"
    ],
    "ans": 1,
    "info": "El padrón municipal de 2023 registraba 17.167 habitantes en Errekaldeberri.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Errekaldeberri?",
    "opts": [
     "Tranvía · T1 Abusu",
     "Tren · Renfe Cercanías Ametzola",
     "Tren · Renfe Cercanías Zorrotza (C-1/C-2/C-4)",
     "Solo autobús"
    ],
    "ans": 3,
    "info": "Errekaldeberri: Solo autobús. Solo autobús",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Errekaldeberri?",
    "opts": [
     "Estación de Ametzola, cubierta por la galería del parque",
     "Errekatartalo, personaje festivo que cuida el barrio desde el Pagasarri",
     "Estatua de Antonio Trueba en los jardines",
     "Fuente de Iturrigorri, la 'fuente roja' que da nombre a la zona"
    ],
    "ans": 1,
    "info": "«Errekatartalo, personaje festivo que cuida el barrio desde el Pagasarri» es un hito de Errekaldeberri.",
    "tipo": "hitoId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Errekatartalo, personaje festivo que cuida el barrio desde el Pagasarri»?",
    "opts": [
     "Matiko",
     "Errekaldeberri",
     "Begoña",
     "Miribilla"
    ],
    "ans": 1,
    "info": "«Errekatartalo, personaje festivo que cuida el barrio desde el Pagasarri» está en Errekaldeberri.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Errekaldeberri?",
    "opts": [
     "Plaza Belate",
     "Entorno de la calle Gurtubay",
     "Plaza de Errekalde",
     "Calzada medieval de Kastrexana"
    ],
    "ans": 2,
    "info": "«Plaza de Errekalde» está en Errekaldeberri.",
    "tipo": "espacioId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Errekalde»?",
    "opts": [
     "Atxuri",
     "Larraskitu",
     "Errekaldeberri",
     "Betolaza"
    ],
    "ans": 2,
    "info": "«Plaza de Errekalde» pertenece a Errekaldeberri.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Universidad Popular y biblioteca de Errekalde»?",
    "opts": [
     "Santutxu",
     "Abando",
     "Errekaldeberri",
     "Ametzola"
    ],
    "ans": 2,
    "info": "«Universidad Popular y biblioteca de Errekalde» está en Errekaldeberri.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de San Antonio de Iturrigorri»?",
    "opts": [
     "Begoña",
     "Errekaldeberri",
     "Albia",
     "Zabala"
    ],
    "ans": 1,
    "info": "«Parque de San Antonio de Iturrigorri» pertenece a Errekaldeberri.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Errekaldeberri?",
    "opts": [
     "San Adrián",
     "Zabala",
     "Larraskitu",
     "Otxarkoaga"
    ],
    "ans": 2,
    "info": "Errekaldeberri y Larraskitu están en el distrito Errekalde.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Errekalde?",
    "opts": [
     "Santutxu",
     "Gurtubay",
     "Errekaldeberri",
     "Artxanda"
    ],
    "ans": 2,
    "info": "Errekaldeberri está en el distrito Errekalde.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Errekaldeberri estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Errekaldeberri no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Abando",
     "Errekaldeberri",
     "Santutxu",
     "Indautxu"
    ],
    "ans": 2,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Asociación de Familias de Rekalde (1966), referencia del movimiento vecinal»?",
    "opts": [
     "Ametzola",
     "Atxuri",
     "Guggenheim - Ensanche",
     "Errekaldeberri"
    ],
    "ans": 3,
    "info": "«Asociación de Familias de Rekalde (1966), referencia del movimiento vecinal» está en Errekaldeberri.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Jardines de Intxaurtxueta»?",
    "opts": [
     "Iralabarri",
     "Indautxu",
     "Errekaldeberri",
     "Albia"
    ],
    "ans": 2,
    "info": "«Jardines de Intxaurtxueta» pertenece a Errekaldeberri.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Errekatartalo, personaje festivo que cuida el barrio desde el Pagasarri»?",
    "opts": [
     "Errekalde",
     "Ibaiondo",
     "Abando",
     "Deustu"
    ],
    "ans": 0,
    "info": "«Errekatartalo, personaje festivo que cuida el barrio desde el Pagasarri» está en Errekaldeberri, distrito Errekalde.",
    "tipo": "hitoDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de Errekalde»?",
    "opts": [
     "Ibaiondo",
     "Begoña",
     "Abando",
     "Errekalde"
    ],
    "ans": 3,
    "info": "«Plaza de Errekalde» está en Errekaldeberri, distrito Errekalde.",
    "tipo": "espacioDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Errekalde?",
    "opts": [
     "San Pedro de Deusto",
     "Uretamendi",
     "Betolaza",
     "Iturrigorri - Peñascal"
    ],
    "ans": 0,
    "info": "San Pedro de Deusto no está en Errekalde.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Errekatartalo, personaje festivo que cuida el barrio desde el Pagasarri» está en Errekaldeberri?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Errekaldeberri.",
    "tipo": "tfHitoYes",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Errekaldeberri?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, ese hito no está en Errekaldeberri.",
    "tipo": "tfHitoNo",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   }
  ]
 },
 {
  "nombre": "Larraskitu",
  "distrito": "Errekalde",
  "lema": "Valle escondido entre robles",
  "pintxo": {
   "nombre": "Pintxo de chorizo a la sidra de Larraskitu",
   "ingrediente": "chorizo a la sidra",
   "color": "#e7c15a",
   "forma": 1
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://aunamendi.eusko-ikaskuntza.eus/es/larraskitu/ar-86125/",
   "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Larraskitu?",
    "opts": [
     "Abando",
     "Errekalde",
     "Deustu",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 1,
    "info": "Larraskitu forma parte del distrito Errekalde.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Larraskitu en el padrón de 2023?",
    "opts": [
     "3882",
     "19.961",
     "3257",
     "171"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 3257 habitantes en Larraskitu.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Larraskitu?",
    "opts": [
     "Solo autobús",
     "Tren · Renfe Cercanías Miribilla",
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)",
     "Autobús y pasarelas peatonales"
    ],
    "ans": 0,
    "info": "Larraskitu: Solo autobús. Solo autobús",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Larraskitu?",
    "opts": [
     "Antiguos cuarteles de Garellano",
     "Torre de Arane",
     "Monte Banderas (223 m), en cuya falda se asienta el barrio",
     "Estación de metro San Inazio"
    ],
    "ans": 1,
    "info": "«Torre de Arane» es un hito de Larraskitu.",
    "tipo": "hitoId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Torre de Arane»?",
    "opts": [
     "Larraskitu",
     "Zurbaran",
     "San Mamés",
     "Matiko"
    ],
    "ans": 0,
    "info": "«Torre de Arane» está en Larraskitu.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Larraskitu?",
    "opts": [
     "Plaza de Matos",
     "Plaza de Garellano",
     "Merenderos de la cumbre",
     "Parque de Etxebarria (170.000 m², linde con Santutxu)"
    ],
    "ans": 0,
    "info": "«Plaza de Matos» está en Larraskitu.",
    "tipo": "espacioId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Matos»?",
    "opts": [
     "Monte Caramelo",
     "Olabeaga",
     "Larraskitu",
     "Txurdinaga"
    ],
    "ans": 2,
    "info": "«Plaza de Matos» pertenece a Larraskitu.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Acceso al monte Pagasarri»?",
    "opts": [
     "Betolaza",
     "Begoña",
     "San Ignacio",
     "Larraskitu"
    ],
    "ans": 3,
    "info": "«Acceso al monte Pagasarri» está en Larraskitu.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Campa de Artapeta»?",
    "opts": [
     "Albia",
     "Kastrexana",
     "Larraskitu",
     "La Peña"
    ],
    "ans": 2,
    "info": "«Campa de Artapeta» pertenece a Larraskitu.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Larraskitu?",
    "opts": [
     "Txurdinaga",
     "Errekaldeberri",
     "Zurbaran",
     "Solokoetxe"
    ],
    "ans": 1,
    "info": "Larraskitu y Errekaldeberri están en el distrito Errekalde.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Errekalde?",
    "opts": [
     "San Mamés",
     "La Peña",
     "Miribilla",
     "Larraskitu"
    ],
    "ans": 3,
    "info": "Larraskitu está en el distrito Errekalde.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Larraskitu estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Larraskitu no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Abando",
     "Indautxu",
     "Santutxu",
     "Larraskitu"
    ],
    "ans": 2,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Torre de Arane»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Basurtu-Zorrotza",
     "Errekalde",
     "Begoña"
    ],
    "ans": 2,
    "info": "«Torre de Arane» está en Larraskitu, distrito Errekalde.",
    "tipo": "hitoDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza de Matos»?",
    "opts": [
     "Errekalde",
     "Deustu",
     "Abando",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 0,
    "info": "«Plaza de Matos» está en Larraskitu, distrito Errekalde.",
    "tipo": "espacioDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Errekalde?",
    "opts": [
     "Uretamendi",
     "San Pedro de Deusto",
     "Iralabarri",
     "Errekaldeberri"
    ],
    "ans": 1,
    "info": "San Pedro de Deusto no está en Errekalde.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Torre de Arane» está en Larraskitu?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Larraskitu.",
    "tipo": "tfHitoYes",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Larraskitu?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese hito no está en Larraskitu.",
    "tipo": "tfHitoNo",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿El espacio «Plaza de Matos» está en Larraskitu?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Larraskitu.",
    "tipo": "tfEspacioYes",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿El espacio «Plaza de San Pedro» está en Larraskitu?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, ese espacio no está en Larraskitu.",
    "tipo": "tfEspacioNo",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/09/Conoce-ERREKALDEBERRI-caminando-v.4.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   }
  ]
 },
 {
  "nombre": "Iturrigorri - Peñascal",
  "distrito": "Errekalde",
  "lema": "Fuente roja al pie del precipicio",
  "pintxo": {
   "nombre": "Pintxo de queso idiazabal de Iturrigorri - Peñascal",
   "ingrediente": "queso idiazabal",
   "color": "#ffd166",
   "forma": 2
  },
  "fuentes": [
   "https://aunamendi.eusko-ikaskuntza.eus/es/el-penascal/ar-48683/",
   "https://bilbaobizkaiapeoplesmuseum.com/wp-content/uploads/2022/10/El-penaskal-con-nombres-propios.pdf",
   "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Iturrigorri - Peñascal?",
    "opts": [
     "Errekalde",
     "Uribarri",
     "Abando",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 0,
    "info": "Iturrigorri - Peñascal forma parte del distrito Errekalde.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Iturrigorri - Peñascal en el padrón de 2023?",
    "opts": [
     "9679",
     "12.897",
     "1679",
     "1812"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 1679 habitantes en Iturrigorri - Peñascal.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Iturrigorri - Peñascal?",
    "opts": [
     "13 ha",
     "18 ha",
     "12 ha",
     "11 ha"
    ],
    "ans": 1,
    "info": "Iturrigorri - Peñascal ocupa aproximadamente 18 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Iturrigorri - Peñascal?",
    "opts": [
     "143,7 hab/ha",
     "278,8 hab/ha",
     "263 hab/ha",
     "93,3 hab/ha"
    ],
    "ans": 3,
    "info": "La densidad de Iturrigorri - Peñascal ronda los 93,3 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Iturrigorri - Peñascal?",
    "opts": [
     "Solo autobús",
     "Tren · Renfe Cercanías Miribilla",
     "Metro · Santimami/San Mamés (L1/L2)",
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)"
    ],
    "ans": 0,
    "info": "Iturrigorri - Peñascal: Solo autobús. Solo autobús, con buena conexión al centro",
    "tipo": "access",
    "fuente": "https://aunamendi.eusko-ikaskuntza.eus/es/el-penascal/ar-48683/",
    "fuenteTitulo": "Auñamendi Eusko Entziklopedia"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Iturrigorri - Peñascal?",
    "opts": [
     "Mirador de Uretamendi sobre los tejados de Errekalde",
     "Fuente de Iturrigorri, la 'fuente roja' que da nombre a la zona",
     "Santa Ana de Bolueta, primera planta moderna de transformación de acero de Bizkaia (1840)",
     "Mirador con vistas panorámicas sobre Bilbao"
    ],
    "ans": 1,
    "info": "«Fuente de Iturrigorri, la 'fuente roja' que da nombre a la zona» es un hito de Iturrigorri - Peñascal.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
    "fuenteTitulo": "Wikipedia: Iturrigorri-El Peñascal"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Fuente de Iturrigorri, la 'fuente roja' que da nombre a la zona»?",
    "opts": [
     "Mina del Morro",
     "Iturrigorri - Peñascal",
     "Guggenheim - Ensanche",
     "Iralabarri"
    ],
    "ans": 1,
    "info": "«Fuente de Iturrigorri, la 'fuente roja' que da nombre a la zona» está en Iturrigorri - Peñascal.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
    "fuenteTitulo": "Wikipedia: Iturrigorri-El Peñascal"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Iturrigorri - Peñascal?",
    "opts": [
     "Jardines de Mrs. Leah Manning",
     "Plaza del Funicular",
     "Zona de parkour y patinaje del Parque Sarriko",
     "Plaza Belate"
    ],
    "ans": 3,
    "info": "«Plaza Belate» está en Iturrigorri - Peñascal.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
    "fuenteTitulo": "Wikipedia: Iturrigorri-El Peñascal"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Belate»?",
    "opts": [
     "San Mamés",
     "Bolueta",
     "Solokoetxe",
     "Iturrigorri - Peñascal"
    ],
    "ans": 3,
    "info": "«Plaza Belate» pertenece a Iturrigorri - Peñascal.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
    "fuenteTitulo": "Wikipedia: Iturrigorri-El Peñascal"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Memoria de la cantera de la mina 'Rosita' (catástrofe de 1899)»?",
    "opts": [
     "San Pedro de Deusto",
     "Iturrigorri - Peñascal",
     "Zorrotzaurre",
     "Ametzola"
    ],
    "ans": 1,
    "info": "«Memoria de la cantera de la mina 'Rosita' (catástrofe de 1899)» está en Iturrigorri - Peñascal.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
    "fuenteTitulo": "Wikipedia: Iturrigorri-El Peñascal"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque Gaztelupiko (Uretamendi)»?",
    "opts": [
     "Monte Caramelo",
     "Atxuri",
     "Iturrigorri - Peñascal",
     "Zazpikaleak"
    ],
    "ans": 2,
    "info": "«Parque Gaztelupiko (Uretamendi)» pertenece a Iturrigorri - Peñascal.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
    "fuenteTitulo": "Wikipedia: Iturrigorri-El Peñascal"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Iturrigorri - Peñascal?",
    "opts": [
     "Otxarkoaga",
     "Errekaldeberri",
     "San Ignacio",
     "Casco Viejo"
    ],
    "ans": 1,
    "info": "Iturrigorri - Peñascal y Errekaldeberri están en el distrito Errekalde.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Errekalde?",
    "opts": [
     "Indautxu",
     "Gurtubay",
     "Iturrigorri - Peñascal",
     "Altamira"
    ],
    "ans": 2,
    "info": "Iturrigorri - Peñascal está en el distrito Errekalde.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Iturrigorri - Peñascal estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Iturrigorri - Peñascal no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://aunamendi.eusko-ikaskuntza.eus/es/el-penascal/ar-48683/",
    "fuenteTitulo": "Auñamendi Eusko Entziklopedia"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Abando",
     "Iturrigorri - Peñascal",
     "Indautxu"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Zonas históricas de Gardeazabal, Iturrigorri, Camino de Arraiz y Peñascal Alto»?",
    "opts": [
     "Iturrigorri - Peñascal",
     "Uretamendi",
     "Olabeaga",
     "Arabella"
    ],
    "ans": 0,
    "info": "«Zonas históricas de Gardeazabal, Iturrigorri, Camino de Arraiz y Peñascal Alto» está en Iturrigorri - Peñascal.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
    "fuenteTitulo": "Wikipedia: Iturrigorri-El Peñascal"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Fuente de Iturrigorri, la 'fuente roja' que da nombre a la zona»?",
    "opts": [
     "Begoña",
     "Errekalde",
     "Ibaiondo",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 1,
    "info": "«Fuente de Iturrigorri, la 'fuente roja' que da nombre a la zona» está en Iturrigorri - Peñascal, distrito Errekalde.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
    "fuenteTitulo": "Wikipedia: Iturrigorri-El Peñascal"
   },
   {
    "q": "¿En qué distrito se encuentra «Plaza Belate»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Errekalde",
     "Deustu",
     "Begoña"
    ],
    "ans": 1,
    "info": "«Plaza Belate» está en Iturrigorri - Peñascal, distrito Errekalde.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Iturrigorri-El_Pe%C3%B1ascal",
    "fuenteTitulo": "Wikipedia: Iturrigorri-El Peñascal"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Abando",
     "Zorrotza",
     "Iturrigorri - Peñascal",
     "Txurdinaga"
    ],
    "ans": 1,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Iturralde",
     "Solokoetxe",
     "Ametzola",
     "Iturrigorri - Peñascal"
    ],
    "ans": 0,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Betolaza",
  "distrito": "Errekalde",
  "lema": "Atalaya sobre los tejados",
  "pintxo": {
   "nombre": "Pintxo de nuez de Betolaza",
   "ingrediente": "nuez",
   "color": "#a5d8ff",
   "forma": 3
  },
  "fuentes": [
   "https://www.deia.eus/bizkaia/2019/09/30/betolaza-barrio-bilbao-pleno-derecho-4754123.html",
   "https://www.euskadi.eus/contenidos/informacion/eaes_179_betolaza_uretamendi/es_def/adjuntos/Borrador%20del%20Plan.pdf",
   "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Betolaza?",
    "opts": [
     "Begoña",
     "Deustu",
     "Errekalde",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 2,
    "info": "Betolaza forma parte del distrito Errekalde.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Betolaza en el padrón de 2023?",
    "opts": [
     "3882",
     "17.167",
     "12.304",
     "171"
    ],
    "ans": 3,
    "info": "El padrón municipal de 2023 registraba 171 habitantes en Betolaza.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Betolaza?",
    "opts": [
     "Tranvía · T1 Abusu",
     "Tren · Renfe Cercanías Olabeaga",
     "Solo autobús",
     "Metro · Zurbaranbarri (L3)"
    ],
    "ans": 2,
    "info": "Betolaza: Solo autobús. Solo autobús; ladera alta de Errekalde",
    "tipo": "access",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Betolaza?",
    "opts": [
     "Acceso al monte Pagasarri",
     "Plan urbanístico de Zaha Hadid para la isla",
     "Casas autoconstruidas en los años sesenta sobre antiguas minas de hierro",
     "Estatua de Antonio Trueba en los jardines"
    ],
    "ans": 2,
    "info": "«Casas autoconstruidas en los años sesenta sobre antiguas minas de hierro» es un hito de Betolaza.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Casas autoconstruidas en los años sesenta sobre antiguas minas de hierro»?",
    "opts": [
     "Albia",
     "Betolaza",
     "Guggenheim - Ensanche",
     "Monte Caramelo"
    ],
    "ans": 1,
    "info": "«Casas autoconstruidas en los años sesenta sobre antiguas minas de hierro» está en Betolaza.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Betolaza?",
    "opts": [
     "Parque Etxebarria (170.000 m², el mayor parque urbano de Bilbao)",
     "Nueva plaza de Betolaza",
     "Jardines de La Floresta",
     "Plaza de los Profesionales Sanitarios"
    ],
    "ans": 1,
    "info": "«Nueva plaza de Betolaza» está en Betolaza.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Nueva plaza de Betolaza»?",
    "opts": [
     "Zazpikaleak",
     "Elorrieta",
     "Betolaza",
     "Mina del Morro"
    ],
    "ans": 2,
    "info": "«Nueva plaza de Betolaza» pertenece a Betolaza.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Barrio oficial de Bilbao desde 2019»?",
    "opts": [
     "Matiko",
     "Betolaza",
     "Indautxu",
     "Olabeaga"
    ],
    "ans": 1,
    "info": "«Barrio oficial de Bilbao desde 2019» está en Betolaza.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Mirador de Uretamendi»?",
    "opts": [
     "Betolaza",
     "San Adrián",
     "Arabella",
     "San Mamés"
    ],
    "ans": 0,
    "info": "«Mirador de Uretamendi» pertenece a Betolaza.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Betolaza?",
    "opts": [
     "Zorrotzaurre",
     "Errekaldeberri",
     "San Pedro de Deusto",
     "Mina del Morro"
    ],
    "ans": 1,
    "info": "Betolaza y Errekaldeberri están en el distrito Errekalde.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Errekalde?",
    "opts": [
     "Betolaza",
     "Albia",
     "La Peña",
     "Ciudad Jardín"
    ],
    "ans": 0,
    "info": "Betolaza está en el distrito Errekalde.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Betolaza estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Betolaza no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Abando",
     "Betolaza",
     "Indautxu",
     "Santutxu"
    ],
    "ans": 3,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Mirador de Uretamendi sobre los tejados de Errekalde»?",
    "opts": [
     "Bolueta",
     "Betolaza",
     "San Francisco",
     "Iturrigorri - Peñascal"
    ],
    "ans": 1,
    "info": "«Mirador de Uretamendi sobre los tejados de Errekalde» está en Betolaza.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Ladera del monte Kobeta»?",
    "opts": [
     "Kastrexana",
     "Ciudad Jardín",
     "Betolaza",
     "Uretamendi"
    ],
    "ans": 2,
    "info": "«Ladera del monte Kobeta» pertenece a Betolaza.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Casas autoconstruidas en los años sesenta sobre antiguas minas de hierro»?",
    "opts": [
     "Begoña",
     "Otxarkoaga-Txurdinaga",
     "Errekalde",
     "Uribarri"
    ],
    "ans": 2,
    "info": "«Casas autoconstruidas en los años sesenta sobre antiguas minas de hierro» está en Betolaza, distrito Errekalde.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿En qué distrito se encuentra «Nueva plaza de Betolaza»?",
    "opts": [
     "Begoña",
     "Errekalde",
     "Basurtu-Zorrotza",
     "Abando"
    ],
    "ans": 1,
    "info": "«Nueva plaza de Betolaza» está en Betolaza, distrito Errekalde.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Errekalde?",
    "opts": [
     "Uretamendi",
     "Iralabarri",
     "San Pedro de Deusto",
     "Errekaldeberri"
    ],
    "ans": 2,
    "info": "San Pedro de Deusto no está en Errekalde.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Casas autoconstruidas en los años sesenta sobre antiguas minas de hierro» está en Betolaza?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Betolaza.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Betolaza?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, ese hito no está en Betolaza.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Recaldeberri-Larrasquitu",
    "fuenteTitulo": "Wikipedia: Recaldeberri-Larrasquitu"
   }
  ]
 },
 {
  "nombre": "Uretamendi",
  "distrito": "Errekalde",
  "lema": "Monte de aguas y horizonte amplio",
  "pintxo": {
   "nombre": "Pintxo de aceituna negra de Uretamendi",
   "ingrediente": "aceituna negra",
   "color": "#e7c15a",
   "forma": 4
  },
  "fuentes": [
   "https://es.wikipedia.org/wiki/Uretamendi",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Uretamendi?",
    "opts": [
     "Ibaiondo",
     "Errekalde",
     "Deustu",
     "Uribarri"
    ],
    "ans": 1,
    "info": "Uretamendi forma parte del distrito Errekalde.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Uretamendi en el padrón de 2023?",
    "opts": [
     "3999",
     "10.520",
     "2469",
     "19.961"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 2469 habitantes en Uretamendi.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Uretamendi?",
    "opts": [
     "38 ha",
     "41 ha",
     "81 ha",
     "20 ha"
    ],
    "ans": 3,
    "info": "Uretamendi ocupa aproximadamente 20 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Uretamendi?",
    "opts": [
     "403 hab/ha",
     "380,7 hab/ha",
     "52,4 hab/ha",
     "123,5 hab/ha"
    ],
    "ans": 3,
    "info": "La densidad de Uretamendi ronda los 123,5 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Uretamendi?",
    "opts": [
     "Solo autobús",
     "Tren · Renfe Cercanías Olabeaga",
     "Metro · Zurbaranbarri (L3)",
     "Metro · Deustu (L1/L2)"
    ],
    "ans": 0,
    "info": "Uretamendi: Solo autobús. Solo autobús",
    "tipo": "access",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Uretamendi?",
    "opts": [
     "Iglesia de Nuestra Señora de Belén",
     "Museo de Pasos de Semana Santa de Bilbao",
     "Asociación de Familias de Rekalde (1966), referencia del movimiento vecinal",
     "Jardines de Albia, en el Ensanche"
    ],
    "ans": 0,
    "info": "«Iglesia de Nuestra Señora de Belén» es un hito de Uretamendi.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Iglesia de Nuestra Señora de Belén»?",
    "opts": [
     "Uretamendi",
     "Guggenheim - Ensanche",
     "Otxarkoaga",
     "Zorrotza"
    ],
    "ans": 0,
    "info": "«Iglesia de Nuestra Señora de Belén» está en Uretamendi.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Uretamendi?",
    "opts": [
     "Parque del Ferial",
     "Jardines Emiliano Arriaga, con cancha de baloncesto",
     "Calles particulares ajardinadas de la cooperativa",
     "Parque 'El corral de la Pacheca'"
    ],
    "ans": 3,
    "info": "«Parque 'El corral de la Pacheca'» está en Uretamendi.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque 'El corral de la Pacheca'»?",
    "opts": [
     "Uretamendi",
     "Arabella",
     "Iralabarri",
     "La Peña"
    ],
    "ans": 0,
    "info": "«Parque 'El corral de la Pacheca'» pertenece a Uretamendi.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Centro cívico junto a la plaza principal»?",
    "opts": [
     "San Adrián",
     "Uretamendi",
     "Arabella",
     "Guggenheim - Ensanche"
    ],
    "ans": 1,
    "info": "«Centro cívico junto a la plaza principal» está en Uretamendi.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza principal del barrio»?",
    "opts": [
     "San Pedro de Deusto",
     "Uretamendi",
     "Elorrieta",
     "La Peña"
    ],
    "ans": 1,
    "info": "«Plaza principal del barrio» pertenece a Uretamendi.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Uretamendi?",
    "opts": [
     "Matiko",
     "Errekaldeberri",
     "Santutxu",
     "Ibarrekolanda"
    ],
    "ans": 1,
    "info": "Uretamendi y Errekaldeberri están en el distrito Errekalde.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Errekalde?",
    "opts": [
     "Zurbaran",
     "Artxanda",
     "Uretamendi",
     "Elorrieta"
    ],
    "ans": 2,
    "info": "Uretamendi está en el distrito Errekalde.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Uretamendi estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Uretamendi no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Uretamendi",
     "Abando",
     "Indautxu"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Carretera hacia Arraiz, Pagasarri y Ganekogorta»?",
    "opts": [
     "Ribera de Deusto",
     "Uretamendi",
     "Atxuri",
     "Txurdinaga"
    ],
    "ans": 1,
    "info": "«Carretera hacia Arraiz, Pagasarri y Ganekogorta» está en Uretamendi.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Iglesia de Nuestra Señora de Belén»?",
    "opts": [
     "Errekalde",
     "Basurtu-Zorrotza",
     "Begoña",
     "Ibaiondo"
    ],
    "ans": 0,
    "info": "«Iglesia de Nuestra Señora de Belén» está en Uretamendi, distrito Errekalde.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿En qué distrito se encuentra «Parque 'El corral de la Pacheca'»?",
    "opts": [
     "Errekalde",
     "Deustu",
     "Abando",
     "Uribarri"
    ],
    "ans": 0,
    "info": "«Parque 'El corral de la Pacheca'» está en Uretamendi, distrito Errekalde.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Uretamendi",
    "fuenteTitulo": "Wikipedia: Uretamendi"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Zorrotza",
     "Uretamendi",
     "Abando",
     "Txurdinaga"
    ],
    "ans": 0,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Ametzola",
     "Uretamendi",
     "Solokoetxe",
     "Iturralde"
    ],
    "ans": 3,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Ametzola",
  "distrito": "Errekalde",
  "lema": "El parque donde antes silbaban trenes",
  "pintxo": {
   "nombre": "Pintxo de txaka de Ametzola",
   "ingrediente": "txaka",
   "color": "#f0d27a",
   "forma": 5
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://es.wikipedia.org/wiki/Am%C3%A9zola",
   "https://es.wikipedia.org/wiki/Parque_de_Am%C3%A9zola",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Ametzola?",
    "opts": [
     "Deustu",
     "Errekalde",
     "Basurtu-Zorrotza",
     "Begoña"
    ],
    "ans": 1,
    "info": "Ametzola forma parte del distrito Errekalde.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Ametzola en el padrón de 2023?",
    "opts": [
     "7331",
     "12.135",
     "1685",
     "10.999"
    ],
    "ans": 1,
    "info": "El padrón municipal de 2023 registraba 12.135 habitantes en Ametzola.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Ametzola?",
    "opts": [
     "26 ha",
     "20 ha",
     "32 ha",
     "79 ha"
    ],
    "ans": 0,
    "info": "Ametzola ocupa aproximadamente 26 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Ametzola?",
    "opts": [
     "97,5 hab/ha",
     "466,7 hab/ha",
     "93,3 hab/ha",
     "403 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Ametzola ronda los 466,7 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Ametzola?",
    "opts": [
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)",
     "Tren · Renfe Cercanías Ametzola",
     "Funicular de Artxanda y autobús",
     "Metro · Zurbaranbarri (L3)"
    ],
    "ans": 1,
    "info": "Ametzola: Tren · Renfe Cercanías Ametzola. Estación de Ametzola, cubierta por el parque",
    "tipo": "access",
    "fuente": "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
    "fuenteTitulo": "Renfe"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Ametzola?",
    "opts": [
     "Iglesia del Corazón de María",
     "Estación de Ametzola, cubierta por la galería del parque",
     "Canal de Deusto (en servicio desde 1968)",
     "Puente de La Salve"
    ],
    "ans": 1,
    "info": "«Estación de Ametzola, cubierta por la galería del parque» es un hito de Ametzola.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de Ametzola, cubierta por la galería del parque»?",
    "opts": [
     "Iturrigorri - Peñascal",
     "Altamira",
     "Ametzola",
     "Ibarrekolanda"
    ],
    "ans": 2,
    "info": "«Estación de Ametzola, cubierta por la galería del parque» está en Ametzola.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Ametzola?",
    "opts": [
     "Parque de Ametzola",
     "Ribera del Cadagua",
     "Parque de Mina del Morro",
     "Parque de Etxebarria (170.000 m², linde con Santutxu)"
    ],
    "ans": 0,
    "info": "«Parque de Ametzola» está en Ametzola.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Ametzola»?",
    "opts": [
     "Larraskitu",
     "Ibarrekolanda",
     "San Ignacio",
     "Ametzola"
    ],
    "ans": 3,
    "info": "«Parque de Ametzola» pertenece a Ametzola.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Paseo-mirador y pérgolas con cilindros-linterna sobre el trazado ferroviario»?",
    "opts": [
     "Ametzola",
     "San Ignacio",
     "San Adrián",
     "Betolaza"
    ],
    "ans": 0,
    "info": "«Paseo-mirador y pérgolas con cilindros-linterna sobre el trazado ferroviario» está en Ametzola.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Ametzola»?",
    "opts": [
     "Campuzano",
     "Txurdinaga",
     "Ametzola",
     "Uribarri"
    ],
    "ans": 2,
    "info": "«Plaza de Ametzola» pertenece a Ametzola.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Ametzola?",
    "opts": [
     "La Peña",
     "Begoña",
     "Ciudad Jardín",
     "Errekaldeberri"
    ],
    "ans": 3,
    "info": "Ametzola y Errekaldeberri están en el distrito Errekalde.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Errekalde?",
    "opts": [
     "Ciudad Jardín",
     "Zabala",
     "Ametzola",
     "Bilbao La Vieja"
    ],
    "ans": 2,
    "info": "Ametzola está en el distrito Errekalde.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Ametzola estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Ametzola no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Santutxu",
     "Ametzola",
     "Abando"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Puente de Gordóniz»?",
    "opts": [
     "Atxuri",
     "Castaños",
     "Ametzola",
     "Abando"
    ],
    "ans": 2,
    "info": "«Puente de Gordóniz» está en Ametzola.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de La Casilla»?",
    "opts": [
     "Ametzola",
     "Santutxu",
     "Bilbao La Vieja",
     "Betolaza"
    ],
    "ans": 0,
    "info": "«Plaza de La Casilla» pertenece a Ametzola.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Estación de Ametzola, cubierta por la galería del parque»?",
    "opts": [
     "Abando",
     "Errekalde",
     "Otxarkoaga-Txurdinaga",
     "Basurtu-Zorrotza"
    ],
    "ans": 1,
    "info": "«Estación de Ametzola, cubierta por la galería del parque» está en Ametzola, distrito Errekalde.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿En qué distrito se encuentra «Parque de Ametzola»?",
    "opts": [
     "Deustu",
     "Errekalde",
     "Abando",
     "Uribarri"
    ],
    "ans": 1,
    "info": "«Parque de Ametzola» está en Ametzola, distrito Errekalde.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Am%C3%A9zola",
    "fuenteTitulo": "Wikipedia: Amézola"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Zorrotza",
     "Ametzola",
     "Abando",
     "Txurdinaga"
    ],
    "ans": 0,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Iralabarri",
  "distrito": "Errekalde",
  "lema": "Casas de harina y colores británicos",
  "pintxo": {
   "nombre": "Pintxo de albóndiga de Iralabarri",
   "ingrediente": "albóndiga",
   "color": "#ffd166",
   "forma": 0
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
   "https://es.wikipedia.org/wiki/Iralabarri",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Iralabarri?",
    "opts": [
     "Basurtu-Zorrotza",
     "Uribarri",
     "Begoña",
     "Errekalde"
    ],
    "ans": 3,
    "info": "Iralabarri forma parte del distrito Errekalde.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Iralabarri en el padrón de 2023?",
    "opts": [
     "5103",
     "12.304",
     "2469",
     "10.999"
    ],
    "ans": 1,
    "info": "El padrón municipal de 2023 registraba 12.304 habitantes en Iralabarri.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Iralabarri?",
    "opts": [
     "39 ha",
     "79 ha",
     "26 ha",
     "51 ha"
    ],
    "ans": 0,
    "info": "Iralabarri ocupa aproximadamente 39 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Iralabarri?",
    "opts": [
     "315,5 hab/ha",
     "277,3 hab/ha",
     "403 hab/ha",
     "478,1 hab/ha"
    ],
    "ans": 0,
    "info": "La densidad de Iralabarri ronda los 315,5 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Iralabarri?",
    "opts": [
     "Metro · Uribarri (L3)",
     "Metro (Moyua y Abando)",
     "Solo autobús",
     "Metro · San Inazio (L1/L2)"
    ],
    "ans": 2,
    "info": "Iralabarri: Solo autobús. Sin metro ni tren en el barrio; próximas Zabálburu y Ametzola",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Iralabarri?",
    "opts": [
     "Bilbao Intermodal, antes conocida como Termibus",
     "Facultad de Economía y Empresa (Sarriko, 1962, Rafael Basterrechea)",
     "Mercado San Inazio-Ibarrekolanda",
     "Barriada de Torre Urizar (275 viviendas, proyecto de 1919 de Ricardo Bastida)"
    ],
    "ans": 3,
    "info": "«Barriada de Torre Urizar (275 viviendas, proyecto de 1919 de Ricardo Bastida)» es un hito de Iralabarri.",
    "tipo": "hitoId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Barriada de Torre Urizar (275 viviendas, proyecto de 1919 de Ricardo Bastida)»?",
    "opts": [
     "Ciudad Jardín",
     "Masustegi",
     "Elorrieta",
     "Iralabarri"
    ],
    "ans": 3,
    "info": "«Barriada de Torre Urizar (275 viviendas, proyecto de 1919 de Ricardo Bastida)» está en Iralabarri.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Iralabarri?",
    "opts": [
     "Jardines de Mrs. Leah Manning",
     "Plaza de la Merced",
     "Plaza Ángela Arregi, sobre el mercado",
     "Parque de Eskurtze, con skate y bolera"
    ],
    "ans": 3,
    "info": "«Parque de Eskurtze, con skate y bolera» está en Iralabarri.",
    "tipo": "espacioId",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque de Eskurtze, con skate y bolera»?",
    "opts": [
     "Arabella",
     "San Ignacio",
     "Kastrexana",
     "Iralabarri"
    ],
    "ans": 3,
    "info": "«Parque de Eskurtze, con skate y bolera» pertenece a Iralabarri.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Escuelas de Tomás Camacho (1921, Pedro Ispizua)»?",
    "opts": [
     "Atxuri",
     "Iralabarri",
     "Kastrexana",
     "Olabeaga"
    ],
    "ans": 1,
    "info": "«Escuelas de Tomás Camacho (1921, Pedro Ispizua)» está en Iralabarri.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de la Batalla de Padura»?",
    "opts": [
     "Errekaldeberri",
     "Bilbao La Vieja",
     "Iralabarri",
     "Kastrexana"
    ],
    "ans": 2,
    "info": "«Plaza de la Batalla de Padura» pertenece a Iralabarri.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Iralabarri?",
    "opts": [
     "Indautxu",
     "Otxarkoaga",
     "Guggenheim - Ensanche",
     "Errekaldeberri"
    ],
    "ans": 3,
    "info": "Iralabarri y Errekaldeberri están en el distrito Errekalde.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Errekalde?",
    "opts": [
     "Iralabarri",
     "Txurdinaga",
     "Matiko",
     "Castaños"
    ],
    "ans": 0,
    "info": "Iralabarri está en el distrito Errekalde.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Iralabarri estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Iralabarri no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Iralabarri",
     "Abando",
     "Indautxu",
     "Santutxu"
    ],
    "ans": 3,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Antigua Harino Panadera, origen del barrio»?",
    "opts": [
     "Casco Viejo",
     "Altamira",
     "Iralabarri",
     "Artxanda"
    ],
    "ans": 2,
    "info": "«Antigua Harino Panadera, origen del barrio» está en Iralabarri.",
    "tipo": "hitoRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Urizar»?",
    "opts": [
     "Zabala",
     "Iralabarri",
     "Basurto",
     "Uribarri"
    ],
    "ans": 1,
    "info": "«Plaza de Urizar» pertenece a Iralabarri.",
    "tipo": "espacioRev",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Barriada de Torre Urizar (275 viviendas, proyecto de 1919 de Ricardo Bastida)»?",
    "opts": [
     "Basurtu-Zorrotza",
     "Begoña",
     "Errekalde",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 2,
    "info": "«Barriada de Torre Urizar (275 viviendas, proyecto de 1919 de Ricardo Bastida)» está en Iralabarri, distrito Errekalde.",
    "tipo": "hitoDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿En qué distrito se encuentra «Parque de Eskurtze, con skate y bolera»?",
    "opts": [
     "Ibaiondo",
     "Deustu",
     "Errekalde",
     "Begoña"
    ],
    "ans": 2,
    "info": "«Parque de Eskurtze, con skate y bolera» está en Iralabarri, distrito Errekalde.",
    "tipo": "espacioDistrito",
    "fuente": "https://bilbaokultura.eus/wp-content/uploads/2021/06/Conoce-IRALABARRI-caminando.pdf",
    "fuenteTitulo": "Bilbao Kultura (PDF)"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Abando",
     "Iralabarri",
     "Txurdinaga",
     "Zorrotza"
    ],
    "ans": 3,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_7.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Basurto",
  "distrito": "Basurtu-Zorrotza",
  "lema": "Puerta hospitalaria y guardiana",
  "pintxo": {
   "nombre": "Pintxo de bacalao al pil-pil de Basurto",
   "ingrediente": "bacalao al pil-pil",
   "color": "#e08a4a",
   "forma": 1
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://aunamendi.eusko-ikaskuntza.eus/es/basurto/ar-12036/",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://cms.metrobilbao.eus/sites/default/files/2025-03/METRO%20accesibilidad-cast_1.pdf",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.bilbaopedia.info/basurto-zorrotza",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.euskotren.eus/sites/default/files/horarios/tranvia%20bilbao_horizontal-A3-%20Verano%202025_0.pdf"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Basurto?",
    "opts": [
     "Abando",
     "Begoña",
     "Basurtu-Zorrotza",
     "Errekalde"
    ],
    "ans": 2,
    "info": "Basurto forma parte del distrito Basurtu-Zorrotza.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Basurto en el padrón de 2023?",
    "opts": [
     "1812",
     "14.772",
     "12.691",
     "5372"
    ],
    "ans": 1,
    "info": "El padrón municipal de 2023 registraba 14.772 habitantes en Basurto.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Basurto?",
    "opts": [
     "79 ha",
     "47 ha",
     "11 ha",
     "18 ha"
    ],
    "ans": 0,
    "info": "Basurto ocupa aproximadamente 79 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Basurto?",
    "opts": [
     "187 hab/ha",
     "123,5 hab/ha",
     "327,6 hab/ha",
     "277,3 hab/ha"
    ],
    "ans": 0,
    "info": "La densidad de Basurto ronda los 187 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Basurto?",
    "opts": [
     "Otxarkoaga (L3)",
     "Sarriko (L1/L2)",
     "Indautxu (L1/L2)",
     "Santimami/San Mamés (L1/L2)"
    ],
    "ans": 3,
    "info": "La estación de metro más próxima es Santimami/San Mamés (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Basurto?",
    "opts": [
     "Metro · Txurdinaga (L3)",
     "Metro · Uribarri (L3)",
     "Tren (FEVE) y autobús",
     "Metro · Santimami/San Mamés (L1/L2)"
    ],
    "ans": 3,
    "info": "Basurto: Metro · Santimami/San Mamés (L1/L2). Metro, tranvía y Cercanías junto al estadio y el hospital",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Basurto?",
    "opts": [
     "Memoria del antiguo barrio y caseríos de Goiri y del convento de Capuchinos (s. XVIII)",
     "Estadio de San Mamés, 'La Catedral'",
     "Albergue de peregrinos del Camino Kobetas",
     "Casa Socorro (1914), hoy Kultur Etxea"
    ],
    "ans": 1,
    "info": "«Estadio de San Mamés, 'La Catedral'» es un hito de Basurto.",
    "tipo": "hitoId",
    "fuente": "https://www.bilbaopedia.info/basurto-zorrotza",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estadio de San Mamés, 'La Catedral'»?",
    "opts": [
     "Zabala",
     "Begoña",
     "Basurto",
     "Ribera de Deusto"
    ],
    "ans": 2,
    "info": "«Estadio de San Mamés, 'La Catedral'» está en Basurto.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/basurto-zorrotza",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Basurto?",
    "opts": [
     "Plaza con centro social de la urbanización y red de senderos",
     "Plaza del Funicular",
     "Parque Gaztelupiko (Uretamendi)",
     "Jardines de Iparralde"
    ],
    "ans": 3,
    "info": "«Jardines de Iparralde» está en Basurto.",
    "tipo": "espacioId",
    "fuente": "https://www.bilbaopedia.info/basurto-zorrotza",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Jardines de Iparralde»?",
    "opts": [
     "Begoña",
     "Basurto",
     "San Francisco",
     "Altamira"
    ],
    "ans": 1,
    "info": "«Jardines de Iparralde» pertenece a Basurto.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/basurto-zorrotza",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Hospital Universitario de Basurto (Hospital Civil, 1900)»?",
    "opts": [
     "Artxanda",
     "Ciudad Jardín",
     "Basurto",
     "Txurdinaga"
    ],
    "ans": 2,
    "info": "«Hospital Universitario de Basurto (Hospital Civil, 1900)» está en Basurto.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/basurto-zorrotza",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Garellano»?",
    "opts": [
     "Basurto",
     "Elorrieta",
     "Errekaldeberri",
     "San Adrián"
    ],
    "ans": 0,
    "info": "«Plaza de Garellano» pertenece a Basurto.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/basurto-zorrotza",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Basurto?",
    "opts": [
     "San Mamés",
     "Santutxu",
     "Zazpikaleak",
     "Txurdinaga"
    ],
    "ans": 0,
    "info": "Basurto y San Mamés están en el distrito Basurtu-Zorrotza.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "San Francisco",
     "Basurto",
     "Ciudad Jardín",
     "Bilbao La Vieja"
    ],
    "ans": 1,
    "info": "Basurto está en el distrito Basurtu-Zorrotza.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Basurto estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí: Santimami/San Mamés (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Santimami/San Mamés (L1/L2) da servicio a Basurto?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, Santimami/San Mamés (L1/L2) es la estación de metro de Basurto.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Basurto?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Basurto.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Basurto",
     "Indautxu",
     "Abando"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Casa de Misericordia, en el solar del antiguo convento de San Mamés»?",
    "opts": [
     "Errekaldeberri",
     "Basurto",
     "Bolueta",
     "Campuzano"
    ],
    "ans": 1,
    "info": "«Casa de Misericordia, en el solar del antiguo convento de San Mamés» está en Basurto.",
    "tipo": "hitoRev",
    "fuente": "https://www.bilbaopedia.info/basurto-zorrotza",
    "fuenteTitulo": "bilbaopedia.info"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de Latorre»?",
    "opts": [
     "Artxanda",
     "Matiko",
     "Basurto",
     "San Ignacio"
    ],
    "ans": 2,
    "info": "«Plaza de Latorre» pertenece a Basurto.",
    "tipo": "espacioRev",
    "fuente": "https://www.bilbaopedia.info/basurto-zorrotza",
    "fuenteTitulo": "bilbaopedia.info"
   }
  ]
 },
 {
  "nombre": "San Mamés",
  "distrito": "Basurtu-Zorrotza",
  "lema": "La catedral del rugido eterno",
  "pintxo": {
   "nombre": "Pintxo de chuleta de buey de San Mamés",
   "ingrediente": "chuleta de buey",
   "color": "#ffd166",
   "forma": 2
  },
  "fuentes": [
   "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
   "https://es.wikipedia.org/wiki/Estadio_de_San_Mam%C3%A9s",
   "https://en.wikipedia.org/wiki/San_Mam%C3%A9s_Stadium_(2013)",
   "https://www.athletic-club.eus/",
   "https://www.bilbaointermodal.eus/es/contacto.html",
   "https://www.bilbaoturismo.net/BilbaoTurismo/es/bus/bilbaointermodal",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de San Mamés?",
    "opts": [
     "Uribarri",
     "Deustu",
     "Basurtu-Zorrotza",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 2,
    "info": "San Mamés forma parte del distrito Basurtu-Zorrotza.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a San Mamés?",
    "opts": [
     "Txurdinaga (L3)",
     "Otxarkoaga (L3)",
     "Basarrate (L1/L2)",
     "Santimami/San Mamés (L1/L2)"
    ],
    "ans": 3,
    "info": "La estación de metro más próxima es Santimami/San Mamés (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de San Mamés?",
    "opts": [
     "Metro, tranvía, tren y autobús",
     "Tren · Renfe Cercanías Ametzola",
     "Metro · Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Tranvía · T1 Atxuri"
    ],
    "ans": 0,
    "info": "San Mamés: Metro, tranvía, tren y autobús. Intermodal de San Mamés: metro, tranvía, tren y autobuses",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de San Mamés?",
    "opts": [
     "Carretera hacia Arraiz, Pagasarri y Ganekogorta",
     "Estadio San Mamés, inaugurado en 2013",
     "Colegio Alemán",
     "Ermita de San Francisco de Paula, 'San Francisquito' (1737), origen del nombre del barrio"
    ],
    "ans": 1,
    "info": "«Estadio San Mamés, inaugurado en 2013» es un hito de San Mamés.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estadio San Mamés, inaugurado en 2013»?",
    "opts": [
     "Ibarrekolanda",
     "Iralabarri",
     "Matiko",
     "San Mamés"
    ],
    "ans": 3,
    "info": "«Estadio San Mamés, inaugurado en 2013» está en San Mamés.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a San Mamés?",
    "opts": [
     "Jardines Emiliano Arriaga, con cancha de baloncesto",
     "Explanada de San Mamés",
     "Plaza Iturriondo",
     "Parque Gaztelupiko (Uretamendi)"
    ],
    "ans": 1,
    "info": "«Explanada de San Mamés» está en San Mamés.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Explanada de San Mamés»?",
    "opts": [
     "Arabella",
     "San Mamés",
     "Kastrexana",
     "Iturrigorri - Peñascal"
    ],
    "ans": 1,
    "info": "«Explanada de San Mamés» pertenece a San Mamés.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Sede del Athletic Club»?",
    "opts": [
     "Guggenheim - Ensanche",
     "Albia",
     "Masustegi",
     "San Mamés"
    ],
    "ans": 3,
    "info": "«Sede del Athletic Club» está en San Mamés.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que San Mamés?",
    "opts": [
     "Betolaza",
     "Basurto",
     "Elorrieta",
     "Matiko"
    ],
    "ans": 1,
    "info": "San Mamés y Basurto están en el distrito Basurtu-Zorrotza.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Ibarrekolanda",
     "San Mamés",
     "San Francisco",
     "Matiko"
    ],
    "ans": 1,
    "info": "San Mamés está en el distrito Basurtu-Zorrotza.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene San Mamés estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: Santimami/San Mamés (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Santimami/San Mamés (L1/L2) da servicio a San Mamés?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, Santimami/San Mamés (L1/L2) es la estación de metro de San Mamés.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a San Mamés?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, Deustu (L1/L2) no es la estación de San Mamés.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación intermodal Bilbao Intermodal»?",
    "opts": [
     "San Mamés",
     "Uretamendi",
     "Castaños",
     "Basurto"
    ],
    "ans": 0,
    "info": "«Estación intermodal Bilbao Intermodal» está en San Mamés.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Estadio San Mamés, inaugurado en 2013»?",
    "opts": [
     "Abando",
     "Errekalde",
     "Ibaiondo",
     "Basurtu-Zorrotza"
    ],
    "ans": 3,
    "info": "«Estadio San Mamés, inaugurado en 2013» está en San Mamés, distrito Basurtu-Zorrotza.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra «Explanada de San Mamés»?",
    "opts": [
     "Ibaiondo",
     "Errekalde",
     "Begoña",
     "Basurtu-Zorrotza"
    ],
    "ans": 3,
    "info": "«Explanada de San Mamés» está en San Mamés, distrito Basurtu-Zorrotza.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Monte Caramelo",
     "Gurtubay",
     "Basurto",
     "San Pedro de Deusto"
    ],
    "ans": 3,
    "info": "San Pedro de Deusto no está en Basurtu-Zorrotza.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene San Mamés parada de tranvía?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, San Mamés cuenta con parada de tranvía.",
    "tipo": "tranviaTF",
    "fuente": "https://www.euskotren.eus/es/tranvia/bilbao",
    "fuenteTitulo": "Euskotren"
   },
   {
    "q": "¿El hito «Estadio San Mamés, inaugurado en 2013» está en San Mamés?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en San Mamés.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en San Mamés?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese hito no está en San Mamés.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/San_Mam%C3%A9s_(Bilbao)",
    "fuenteTitulo": "Wikipedia: San Mamés (Bilbao)"
   }
  ]
 },
 {
  "nombre": "Altamira",
  "distrito": "Basurtu-Zorrotza",
  "lema": "Mirada alta que domina la ría",
  "pintxo": {
   "nombre": "Pintxo de morcilla de arroz de Altamira",
   "ingrediente": "morcilla de arroz",
   "color": "#a5d8ff",
   "forma": 3
  },
  "fuentes": [
   "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
   "https://es.wikipedia.org/wiki/Monte_Cobetas",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Altamira?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Basurtu-Zorrotza",
     "Ibaiondo",
     "Uribarri"
    ],
    "ans": 1,
    "info": "Altamira forma parte del distrito Basurtu-Zorrotza.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Altamira en el padrón de 2023?",
    "opts": [
     "1812",
     "388",
     "7370",
     "5103"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 1812 habitantes en Altamira.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Altamira?",
    "opts": [
     "12 ha",
     "15 ha",
     "129 ha",
     "47 ha"
    ],
    "ans": 1,
    "info": "Altamira ocupa aproximadamente 15 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Altamira?",
    "opts": [
     "93,3 hab/ha",
     "232,1 hab/ha",
     "120,8 hab/ha",
     "315,5 hab/ha"
    ],
    "ans": 2,
    "info": "La densidad de Altamira ronda los 120,8 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Altamira?",
    "opts": [
     "Autobús y pasarelas peatonales",
     "Tren · Renfe Cercanías Zorrotza (C-1/C-2/C-4)",
     "Metro · Deustu (L1/L2)",
     "Solo autobús"
    ],
    "ans": 3,
    "info": "Altamira: Solo autobús. Solo autobús (Kobetas)",
    "tipo": "access",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Altamira?",
    "opts": [
     "Bilbao Intermodal, antes conocida como Termibus",
     "Albergue de peregrinos del Camino Kobetas",
     "Antiguos astilleros y naves industriales",
     "Asociación de Familias de Rekalde (1966), referencia del movimiento vecinal"
    ],
    "ans": 1,
    "info": "«Albergue de peregrinos del Camino Kobetas» es un hito de Altamira.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Albergue de peregrinos del Camino Kobetas»?",
    "opts": [
     "Altamira",
     "Uretamendi",
     "Otxarkoaga",
     "San Ignacio"
    ],
    "ans": 0,
    "info": "«Albergue de peregrinos del Camino Kobetas» está en Altamira.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Altamira?",
    "opts": [
     "Plaza de Zumárraga",
     "Plaza de San Felicísimo",
     "Entorno del monte Kobetas y Camino Kobetas",
     "Área deportiva de la plaza de la Encarnación"
    ],
    "ans": 2,
    "info": "«Entorno del monte Kobetas y Camino Kobetas» está en Altamira.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Entorno del monte Kobetas y Camino Kobetas»?",
    "opts": [
     "Altamira",
     "Betolaza",
     "Zurbaran",
     "Masustegi"
    ],
    "ans": 0,
    "info": "«Entorno del monte Kobetas y Camino Kobetas» pertenece a Altamira.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Albergue municipal de Bilbao, a los pies del barrio»?",
    "opts": [
     "Masustegi",
     "Arabella",
     "Guggenheim - Ensanche",
     "Altamira"
    ],
    "ans": 3,
    "info": "«Albergue municipal de Bilbao, a los pies del barrio» está en Altamira.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Altamira?",
    "opts": [
     "Mina del Morro",
     "Miribilla",
     "Otxarkoaga",
     "Basurto"
    ],
    "ans": 3,
    "info": "Altamira y Basurto están en el distrito Basurtu-Zorrotza.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Altamira",
     "Begoña",
     "San Pedro de Deusto",
     "Bilbao La Vieja"
    ],
    "ans": 0,
    "info": "Altamira está en el distrito Basurtu-Zorrotza.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Altamira estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Altamira no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Abando",
     "Altamira",
     "Indautxu",
     "Santutxu"
    ],
    "ans": 3,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Monte Cobetas, en cuyas laderas se construyó el barrio»?",
    "opts": [
     "Arabella",
     "Altamira",
     "Zurbaran",
     "Guggenheim - Ensanche"
    ],
    "ans": 1,
    "info": "«Monte Cobetas, en cuyas laderas se construyó el barrio» está en Altamira.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Albergue de peregrinos del Camino Kobetas»?",
    "opts": [
     "Errekalde",
     "Basurtu-Zorrotza",
     "Otxarkoaga-Txurdinaga",
     "Begoña"
    ],
    "ans": 1,
    "info": "«Albergue de peregrinos del Camino Kobetas» está en Altamira, distrito Basurtu-Zorrotza.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿En qué distrito se encuentra «Entorno del monte Kobetas y Camino Kobetas»?",
    "opts": [
     "Ibaiondo",
     "Begoña",
     "Basurtu-Zorrotza",
     "Abando"
    ],
    "ans": 2,
    "info": "«Entorno del monte Kobetas y Camino Kobetas» está en Altamira, distrito Basurtu-Zorrotza.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Altamira_(Bilbao)",
    "fuenteTitulo": "Wikipedia: Altamira (Bilbao)"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Txurdinaga",
     "Zorrotza",
     "Altamira",
     "Abando"
    ],
    "ans": 1,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Altamira",
     "Ametzola",
     "Iturralde",
     "Solokoetxe"
    ],
    "ans": 2,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Monte Caramelo",
     "Masustegi",
     "San Pedro de Deusto",
     "Zorrotza"
    ],
    "ans": 2,
    "info": "San Pedro de Deusto no está en Basurtu-Zorrotza.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Masustegi",
  "distrito": "Basurtu-Zorrotza",
  "lema": "Casas en cuesta construidas a mano",
  "pintxo": {
   "nombre": "Pintxo de ciruela de Masustegi",
   "ingrediente": "ciruela",
   "color": "#ffd166",
   "forma": 4
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://almabotxera.com/masustegi/",
   "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Masustegi?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Uribarri",
     "Basurtu-Zorrotza",
     "Begoña"
    ],
    "ans": 2,
    "info": "Masustegi forma parte del distrito Basurtu-Zorrotza.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Masustegi en el padrón de 2023?",
    "opts": [
     "3999",
     "24.135",
     "6912",
     "5103"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 3999 habitantes en Masustegi.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Masustegi?",
    "opts": [
     "97 ha",
     "77 ha",
     "41 ha",
     "55 ha"
    ],
    "ans": 2,
    "info": "Masustegi ocupa aproximadamente 41 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Masustegi?",
    "opts": [
     "120,8 hab/ha",
     "97,5 hab/ha",
     "187 hab/ha",
     "238 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Masustegi ronda los 97,5 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Masustegi?",
    "opts": [
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)",
     "Solo autobús",
     "Autobús y pasarelas peatonales",
     "Metro · San Inazio (L1/L2)"
    ],
    "ans": 1,
    "info": "Masustegi: Solo autobús. Solo autobús",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Masustegi?",
    "opts": [
     "Iglesia de San Gabriel, patrón de las fiestas del barrio",
     "Monte Banderas (223 m), en cuya falda se asienta el barrio",
     "Estación de Olabeaga de Cercanías",
     "Polideportivo de Zorrotza, sede del Mundial de Hockey en Línea de 2007"
    ],
    "ans": 0,
    "info": "«Iglesia de San Gabriel, patrón de las fiestas del barrio» es un hito de Masustegi.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Masustegi?",
    "opts": [
     "Jardines de Solokoetxe",
     "Plaza Eugenio Olabarrieta",
     "Plaza de Los Botijos",
     "Jardines de Garate"
    ],
    "ans": 2,
    "info": "«Plaza de Los Botijos» está en Masustegi.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Masustegi?",
    "opts": [
     "Uribarri",
     "Basurto",
     "Iturrigorri - Peñascal",
     "Ametzola"
    ],
    "ans": 1,
    "info": "Masustegi y Basurto están en el distrito Basurtu-Zorrotza.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Uretamendi",
     "Zurbaran",
     "Masustegi",
     "Zazpikaleak"
    ],
    "ans": 2,
    "info": "Masustegi está en el distrito Basurtu-Zorrotza.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Masustegi estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Masustegi no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Santutxu",
     "Masustegi",
     "Abando"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Masustegi",
     "Zorrotza",
     "Abando",
     "Txurdinaga"
    ],
    "ans": 1,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Masustegi",
     "Iturralde",
     "Ametzola",
     "Solokoetxe"
    ],
    "ans": 1,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Kastrexana",
     "Olabeaga",
     "San Pedro de Deusto",
     "Altamira"
    ],
    "ans": 2,
    "info": "San Pedro de Deusto no está en Basurtu-Zorrotza.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Iglesia de San Gabriel, patrón de las fiestas del barrio» está en Masustegi?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Masustegi.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Masustegi?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, ese hito no está en Masustegi.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿El espacio «Plaza de Los Botijos» está en Masustegi?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Masustegi.",
    "tipo": "tfEspacioYes",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿El espacio «Plaza de San Pedro» está en Masustegi?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese espacio no está en Masustegi.",
    "tipo": "tfEspacioNo",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿El barrio de Masustegi está en el distrito Basurtu-Zorrotza?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, pertenece a Basurtu-Zorrotza.",
    "tipo": "districtTF",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El barrio de Masustegi está en el distrito Deustu?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, está en Basurtu-Zorrotza.",
    "tipo": "districtTFNo",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Monte Caramelo",
  "distrito": "Basurtu-Zorrotza",
  "lema": "Rampa empinada hacia las nubes",
  "pintxo": {
   "nombre": "Pintxo de caramelo de Monte Caramelo",
   "ingrediente": "caramelo",
   "color": "#e7c15a",
   "forma": 5
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://almabotxera.com/masustegi/",
   "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Monte Caramelo?",
    "opts": [
     "Errekalde",
     "Basurtu-Zorrotza",
     "Abando",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 1,
    "info": "Monte Caramelo forma parte del distrito Basurtu-Zorrotza.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Monte Caramelo en el padrón de 2023?",
    "opts": [
     "2469",
     "5454",
     "5103",
     "3999"
    ],
    "ans": 3,
    "info": "El padrón municipal de 2023 registraba 3999 habitantes en Monte Caramelo.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Monte Caramelo?",
    "opts": [
     "97 ha",
     "41 ha",
     "25 ha",
     "17 ha"
    ],
    "ans": 1,
    "info": "Monte Caramelo ocupa aproximadamente 41 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Monte Caramelo?",
    "opts": [
     "206,3 hab/ha",
     "97,5 hab/ha",
     "222,8 hab/ha",
     "7,5 hab/ha"
    ],
    "ans": 1,
    "info": "La densidad de Monte Caramelo ronda los 97,5 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Monte Caramelo?",
    "opts": [
     "Metro · Bolueta (L1/L2)",
     "Metro (Moyua y Abando)",
     "Solo autobús",
     "Metro · Uribarri (L3)"
    ],
    "ans": 2,
    "info": "Monte Caramelo: Solo autobús. Solo autobús",
    "tipo": "access",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Monte Caramelo?",
    "opts": [
     "Fuente de Iturrigorri, la 'fuente roja' que da nombre a la zona",
     "Memoria del convento de San Francisco (bula de 1475), que da nombre al barrio",
     "Escultura La Huella y txakolís de la cumbre",
     "Iglesia de San Gabriel, patrón de las fiestas del barrio"
    ],
    "ans": 3,
    "info": "«Iglesia de San Gabriel, patrón de las fiestas del barrio» es un hito de Monte Caramelo.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Monte Caramelo?",
    "opts": [
     "Plaza de Los Botijos",
     "Plaza Dr. Fleming",
     "Parque Gaztelupiko (Uretamendi)",
     "Entorno del monte Kobetas y Camino Kobetas"
    ],
    "ans": 0,
    "info": "«Plaza de Los Botijos» está en Monte Caramelo.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Monte Caramelo?",
    "opts": [
     "Zazpikaleak",
     "Ribera de Deusto",
     "Basurto",
     "Iturrigorri - Peñascal"
    ],
    "ans": 2,
    "info": "Monte Caramelo y Basurto están en el distrito Basurtu-Zorrotza.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Bolueta",
     "Monte Caramelo",
     "Zazpikaleak",
     "San Ignacio"
    ],
    "ans": 1,
    "info": "Monte Caramelo está en el distrito Basurtu-Zorrotza.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Monte Caramelo estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Monte Caramelo no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Santutxu",
     "Abando",
     "Monte Caramelo",
     "Indautxu"
    ],
    "ans": 0,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Txurdinaga",
     "Monte Caramelo",
     "Abando",
     "Zorrotza"
    ],
    "ans": 3,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Iturralde",
     "Ametzola",
     "Monte Caramelo",
     "Solokoetxe"
    ],
    "ans": 0,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Gurtubay",
     "Basurto",
     "Zorrotza",
     "San Pedro de Deusto"
    ],
    "ans": 3,
    "info": "San Pedro de Deusto no está en Basurtu-Zorrotza.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El hito «Iglesia de San Gabriel, patrón de las fiestas del barrio» está en Monte Caramelo?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Monte Caramelo.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Monte Caramelo?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, ese hito no está en Monte Caramelo.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿El espacio «Plaza de Los Botijos» está en Monte Caramelo?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Monte Caramelo.",
    "tipo": "tfEspacioYes",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿El espacio «Plaza de San Pedro» está en Monte Caramelo?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese espacio no está en Monte Caramelo.",
    "tipo": "tfEspacioNo",
    "fuente": "https://es.wikipedia.org/wiki/Monte_Caramelo-Masustegui",
    "fuenteTitulo": "Wikipedia: Monte Caramelo-Masustegui"
   },
   {
    "q": "¿El barrio de Monte Caramelo está en el distrito Basurtu-Zorrotza?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, pertenece a Basurtu-Zorrotza.",
    "tipo": "districtTF",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿El barrio de Monte Caramelo está en el distrito Deustu?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "No, está en Basurtu-Zorrotza.",
    "tipo": "districtTFNo",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Olabeaga",
  "distrito": "Basurtu-Zorrotza",
  "lema": "Noruega botxera frente a los barcos",
  "pintxo": {
   "nombre": "Pintxo de sardina ahumada de Olabeaga",
   "ingrediente": "sardina ahumada",
   "color": "#f2d27a",
   "forma": 0
  },
  "fuentes": [
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://gl.wikipedia.org/wiki/Olabeaga",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
   "https://www.deia.eus/bilbao/2025/01/12/olabeaga-barrio-maritimo-9146828.html"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Olabeaga?",
    "opts": [
     "Deustu",
     "Basurtu-Zorrotza",
     "Begoña",
     "Errekalde"
    ],
    "ans": 1,
    "info": "Olabeaga forma parte del distrito Basurtu-Zorrotza.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Olabeaga en el padrón de 2023?",
    "opts": [
     "1679",
     "1273",
     "1310",
     "7331"
    ],
    "ans": 2,
    "info": "El padrón municipal de 2023 registraba 1310 habitantes en Olabeaga.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Olabeaga?",
    "opts": [
     "41 ha",
     "39 ha",
     "25 ha",
     "60,1 ha"
    ],
    "ans": 2,
    "info": "Olabeaga ocupa aproximadamente 25 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Olabeaga?",
    "opts": [
     "120,8 hab/ha",
     "7,5 hab/ha",
     "52,4 hab/ha",
     "71,3 hab/ha"
    ],
    "ans": 2,
    "info": "La densidad de Olabeaga ronda los 52,4 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Olabeaga?",
    "opts": [
     "Tren · Renfe Cercanías Olabeaga",
     "Metro, tranvía, tren y autobús",
     "Metro · Sarriko (L1/L2)",
     "Metro · Uribarri (L3)"
    ],
    "ans": 0,
    "info": "Olabeaga: Tren · Renfe Cercanías Olabeaga. Apeadero de Olabeaga junto a la ría",
    "tipo": "access",
    "fuente": "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
    "fuenteTitulo": "Renfe"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Olabeaga?",
    "opts": [
     "Casa Grande de Elorrieta (principios del s. XX)",
     "Cargadero de Olabeaga (1894) y cargadero Gandarias",
     "Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia",
     "Antiguos astilleros y naves industriales"
    ],
    "ans": 1,
    "info": "«Cargadero de Olabeaga (1894) y cargadero Gandarias» es un hito de Olabeaga.",
    "tipo": "hitoId",
    "fuente": "https://gl.wikipedia.org/wiki/Olabeaga",
    "fuenteTitulo": "Wikipedia (gl): Olabeaga"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Cargadero de Olabeaga (1894) y cargadero Gandarias»?",
    "opts": [
     "Olabeaga",
     "Bilbao La Vieja",
     "Abando",
     "La Peña"
    ],
    "ans": 0,
    "info": "«Cargadero de Olabeaga (1894) y cargadero Gandarias» está en Olabeaga.",
    "tipo": "hitoRev",
    "fuente": "https://gl.wikipedia.org/wiki/Olabeaga",
    "fuenteTitulo": "Wikipedia (gl): Olabeaga"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Olabeaga?",
    "opts": [
     "Ribera del Cadagua",
     "Plaza Larrazabal",
     "Frente de ría y paseo junto al cargadero",
     "Campa de Artapeta"
    ],
    "ans": 2,
    "info": "«Frente de ría y paseo junto al cargadero» está en Olabeaga.",
    "tipo": "espacioId",
    "fuente": "https://gl.wikipedia.org/wiki/Olabeaga",
    "fuenteTitulo": "Wikipedia (gl): Olabeaga"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Frente de ría y paseo junto al cargadero»?",
    "opts": [
     "Uretamendi",
     "Olabeaga",
     "Zorrotzaurre",
     "Iturrigorri - Peñascal"
    ],
    "ans": 1,
    "info": "«Frente de ría y paseo junto al cargadero» pertenece a Olabeaga.",
    "tipo": "espacioRev",
    "fuente": "https://gl.wikipedia.org/wiki/Olabeaga",
    "fuenteTitulo": "Wikipedia (gl): Olabeaga"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estación de Olabeaga de Cercanías»?",
    "opts": [
     "San Ignacio",
     "Iturrigorri - Peñascal",
     "Solokoetxe",
     "Olabeaga"
    ],
    "ans": 3,
    "info": "«Estación de Olabeaga de Cercanías» está en Olabeaga.",
    "tipo": "hitoRev",
    "fuente": "https://gl.wikipedia.org/wiki/Olabeaga",
    "fuenteTitulo": "Wikipedia (gl): Olabeaga"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Skatepark de Olabeaga»?",
    "opts": [
     "Albia",
     "Olabeaga",
     "Altamira",
     "Iralabarri"
    ],
    "ans": 1,
    "info": "«Skatepark de Olabeaga» pertenece a Olabeaga.",
    "tipo": "espacioRev",
    "fuente": "https://gl.wikipedia.org/wiki/Olabeaga",
    "fuenteTitulo": "Wikipedia (gl): Olabeaga"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Olabeaga?",
    "opts": [
     "Txurdinaga",
     "Basurto",
     "Iralabarri",
     "San Francisco"
    ],
    "ans": 1,
    "info": "Olabeaga y Basurto están en el distrito Basurtu-Zorrotza.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Santutxu",
     "Iralabarri",
     "Olabeaga",
     "Betolaza"
    ],
    "ans": 2,
    "info": "Olabeaga está en el distrito Basurtu-Zorrotza.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Olabeaga estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Olabeaga no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
    "fuenteTitulo": "bilbaogazte.bilbao.eus"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Olabeaga",
     "Santutxu",
     "Abando",
     "Indautxu"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Santa Casa de la Misericordia, visible sobre el barrio»?",
    "opts": [
     "Indautxu",
     "Olabeaga",
     "Bolueta",
     "Arabella"
    ],
    "ans": 1,
    "info": "«Santa Casa de la Misericordia, visible sobre el barrio» está en Olabeaga.",
    "tipo": "hitoRev",
    "fuente": "https://gl.wikipedia.org/wiki/Olabeaga",
    "fuenteTitulo": "Wikipedia (gl): Olabeaga"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Cargadero de Olabeaga (1894) y cargadero Gandarias»?",
    "opts": [
     "Begoña",
     "Basurtu-Zorrotza",
     "Deustu",
     "Errekalde"
    ],
    "ans": 1,
    "info": "«Cargadero de Olabeaga (1894) y cargadero Gandarias» está en Olabeaga, distrito Basurtu-Zorrotza.",
    "tipo": "hitoDistrito",
    "fuente": "https://gl.wikipedia.org/wiki/Olabeaga",
    "fuenteTitulo": "Wikipedia (gl): Olabeaga"
   },
   {
    "q": "¿En qué distrito se encuentra «Frente de ría y paseo junto al cargadero»?",
    "opts": [
     "Abando",
     "Basurtu-Zorrotza",
     "Begoña",
     "Deustu"
    ],
    "ans": 1,
    "info": "«Frente de ría y paseo junto al cargadero» está en Olabeaga, distrito Basurtu-Zorrotza.",
    "tipo": "espacioDistrito",
    "fuente": "https://gl.wikipedia.org/wiki/Olabeaga",
    "fuenteTitulo": "Wikipedia (gl): Olabeaga"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Abando",
     "Zorrotza",
     "Txurdinaga",
     "Olabeaga"
    ],
    "ans": 1,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál de estos barrios tiene mayor densidad de población?",
    "opts": [
     "Solokoetxe",
     "Iturralde",
     "Ametzola",
     "Olabeaga"
    ],
    "ans": 1,
    "info": "Iturralde tenía la mayor densidad del grupo.",
    "tipo": "densityCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Zorrotza",
  "distrito": "Basurtu-Zorrotza",
  "lema": "Punta afilada donde se unen los ríos",
  "pintxo": {
   "nombre": "Pintxo de anchoa en salazón de Zorrotza",
   "ingrediente": "anchoa en salazón",
   "color": "#f2d27a",
   "forma": 1
  },
  "fuentes": [
   "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://bilbaogazte.bilbao.eus/es/espacios/equipamientos-deportivos-al-aire-libre/",
   "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
   "https://es.wikipedia.org/wiki/Zorroza",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Zorrotza?",
    "opts": [
     "Uribarri",
     "Errekalde",
     "Ibaiondo",
     "Basurtu-Zorrotza"
    ],
    "ans": 3,
    "info": "Zorrotza forma parte del distrito Basurtu-Zorrotza.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuántos habitantes tenía Zorrotza en el padrón de 2023?",
    "opts": [
     "10.999",
     "6912",
     "10.194",
     "12.135"
    ],
    "ans": 0,
    "info": "El padrón municipal de 2023 registraba 10.999 habitantes en Zorrotza.",
    "tipo": "population",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿Qué superficie aproximada tiene Zorrotza?",
    "opts": [
     "17 ha",
     "77 ha",
     "129 ha",
     "117 ha"
    ],
    "ans": 2,
    "info": "Zorrotza ocupa aproximadamente 129 ha.",
    "tipo": "surface",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cuál es la densidad de población aproximada de Zorrotza?",
    "opts": [
     "447,7 hab/ha",
     "7,5 hab/ha",
     "85,3 hab/ha",
     "123,5 hab/ha"
    ],
    "ans": 2,
    "info": "La densidad de Zorrotza ronda los 85,3 hab/ha.",
    "tipo": "density",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Zorrotza?",
    "opts": [
     "Metro · Zazpikaleak/Casco Viejo (L1/L2/L3)",
     "Tren · Renfe Cercanías Zorrotza (C-1/C-2/C-4)",
     "Metro · San Inazio (L1/L2)",
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)"
    ],
    "ans": 1,
    "info": "Zorrotza: Tren · Renfe Cercanías Zorrotza (C-1/C-2/C-4). Doble estación ferroviaria de ancho ibérico y métrico",
    "tipo": "access",
    "fuente": "https://data.renfe.com/dataset/0356d125-ddd2-4db2-9f10-3083c91f3e2a/resource/3254a1ed-a2b7-4fd1-9e9e-23eefe35f162/download/listado-estaciones-cercanias-bilbao.csv",
    "fuenteTitulo": "Renfe"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Zorrotza?",
    "opts": [
     "Restaurante El Amparo, antiguo caserío",
     "Jardines Emiliano Arriaga como espacio deportivo de referencia",
     "Errekatartalo, personaje festivo que cuida el barrio desde el Pagasarri",
     "Polideportivo de Zorrotza, sede del Mundial de Hockey en Línea de 2007"
    ],
    "ans": 3,
    "info": "«Polideportivo de Zorrotza, sede del Mundial de Hockey en Línea de 2007» es un hito de Zorrotza.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Polideportivo de Zorrotza, sede del Mundial de Hockey en Línea de 2007»?",
    "opts": [
     "Zabala",
     "Guggenheim - Ensanche",
     "Zorrotza",
     "Arangoiti"
    ],
    "ans": 2,
    "info": "«Polideportivo de Zorrotza, sede del Mundial de Hockey en Línea de 2007» está en Zorrotza.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Zorrotza?",
    "opts": [
     "Plaza Elíptica (Moyúa)",
     "Parque de Mina del Morro",
     "Parque del Ferial",
     "Parque de Etxebarria (acceso por Mallona)"
    ],
    "ans": 2,
    "info": "«Parque del Ferial» está en Zorrotza.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Parque del Ferial»?",
    "opts": [
     "Altamira",
     "Guggenheim - Ensanche",
     "Zorrotza",
     "San Ignacio"
    ],
    "ans": 2,
    "info": "«Parque del Ferial» pertenece a Zorrotza.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Mercado de las galerías Omega»?",
    "opts": [
     "Betolaza",
     "Abando",
     "Matiko",
     "Zorrotza"
    ],
    "ans": 3,
    "info": "«Mercado de las galerías Omega» está en Zorrotza.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza de San Miguel»?",
    "opts": [
     "Zorrotza",
     "Arangoiti",
     "Zurbaran",
     "Zabala"
    ],
    "ans": 0,
    "info": "«Plaza de San Miguel» pertenece a Zorrotza.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Zorrotza?",
    "opts": [
     "San Francisco",
     "Miribilla",
     "Larraskitu",
     "Basurto"
    ],
    "ans": 3,
    "info": "Zorrotza y Basurto están en el distrito Basurtu-Zorrotza.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Iturrigorri - Peñascal",
     "San Pedro de Deusto",
     "Bolueta",
     "Zorrotza"
    ],
    "ans": 3,
    "info": "Zorrotza está en el distrito Basurtu-Zorrotza.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Zorrotza estación de metro propia?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "Zorrotza no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "http://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos barrios tenía más habitantes en 2023?",
    "opts": [
     "Indautxu",
     "Santutxu",
     "Zorrotza",
     "Abando"
    ],
    "ans": 1,
    "info": "Santutxu era el más poblado del grupo en 2023.",
    "tipo": "popCompare",
    "fuente": "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv",
    "fuenteTitulo": "Ayuntamiento de Bilbao: padrón por barrio 2023"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Estaciones ferroviarias de Zorrotza (ancho ibérico y métrico)»?",
    "opts": [
     "Mina del Morro",
     "Zorrotza",
     "Zorrotzaurre",
     "Arabella"
    ],
    "ans": 1,
    "info": "«Estaciones ferroviarias de Zorrotza (ancho ibérico y métrico)» está en Zorrotza.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Plaza Azoka»?",
    "opts": [
     "Zorrotza",
     "San Francisco",
     "Indautxu",
     "Arabella"
    ],
    "ans": 0,
    "info": "«Plaza Azoka» pertenece a Zorrotza.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Polideportivo de Zorrotza, sede del Mundial de Hockey en Línea de 2007»?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Abando",
     "Basurtu-Zorrotza",
     "Errekalde"
    ],
    "ans": 2,
    "info": "«Polideportivo de Zorrotza, sede del Mundial de Hockey en Línea de 2007» está en Zorrotza, distrito Basurtu-Zorrotza.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿En qué distrito se encuentra «Parque del Ferial»?",
    "opts": [
     "Abando",
     "Uribarri",
     "Begoña",
     "Basurtu-Zorrotza"
    ],
    "ans": 3,
    "info": "«Parque del Ferial» está en Zorrotza, distrito Basurtu-Zorrotza.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Zorroza",
    "fuenteTitulo": "Wikipedia: Zorroza"
   },
   {
    "q": "¿Cuál de estos barrios es más extenso?",
    "opts": [
     "Abando",
     "Zorrotza",
     "Txurdinaga",
     "Indautxu"
    ],
    "ans": 1,
    "info": "Zorrotza era el más extenso del grupo.",
    "tipo": "surfaceCompare",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   }
  ]
 },
 {
  "nombre": "Kastrexana",
  "distrito": "Basurtu-Zorrotza",
  "lema": "El puente del diablo en la calzada",
  "pintxo": {
   "nombre": "Pintxo de trucha de Kastrexana",
   "ingrediente": "trucha",
   "color": "#d9c37a",
   "forma": 2
  },
  "fuentes": [
   "https://es.wikipedia.org/wiki/Kastrexana",
   "https://www.gronze.com/etapa/bilbao-bilbo/portugalete/recorrido",
   "https://turismo.euskadi.eus/contenidos/recurso_tecnico/aa30_folletos/es_def/folletos/2020/camino-santiago-donejakue-pie-07.pdf",
   "https://www.bizkaia.eus/Home2/Archivos/DPTO4/Temas/Patrimonio_Cultural/Jornadas_Europeas_2010/Ezkerraldea.pdf",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Kastrexana?",
    "opts": [
     "Begoña",
     "Ibaiondo",
     "Deustu",
     "Basurtu-Zorrotza"
    ],
    "ans": 3,
    "info": "Kastrexana forma parte del distrito Basurtu-Zorrotza.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Kastrexana?",
    "opts": [
     "Metro, tranvía, tren y autobús",
     "Tren (FEVE) y autobús",
     "Tren · Renfe Cercanías Zorrotza (C-1/C-2/C-4)",
     "Tren · Renfe Cercanías Zabalburu (C-1/C-2)"
    ],
    "ans": 1,
    "info": "Kastrexana: Tren (FEVE) y autobús. Apeadero de FEVE en la línea Bilbao-Balmaseda y autobús",
    "tipo": "access",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Kastrexana?",
    "opts": [
     "Sede del Athletic Club",
     "Canal de Deusto (1950-1968), que convirtió Zorrotzaurre en isla",
     "Puente del Diablo, de un solo arco sobre el Cadagua",
     "Antiguo hospital de Bilbao, primera sede del Museo de Bellas Artes (1914) y hoy instituto Emilio Campuzano"
    ],
    "ans": 2,
    "info": "«Puente del Diablo, de un solo arco sobre el Cadagua» es un hito de Kastrexana.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Puente del Diablo, de un solo arco sobre el Cadagua»?",
    "opts": [
     "Castaños",
     "Kastrexana",
     "Otxarkoaga",
     "Zorrotza"
    ],
    "ans": 1,
    "info": "«Puente del Diablo, de un solo arco sobre el Cadagua» está en Kastrexana.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Kastrexana?",
    "opts": [
     "Plaza de Moraza",
     "Plaza de San Pedro",
     "Plaza de la Merced",
     "Ribera del Cadagua"
    ],
    "ans": 3,
    "info": "«Ribera del Cadagua» está en Kastrexana.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Ribera del Cadagua»?",
    "opts": [
     "Guggenheim - Ensanche",
     "Ametzola",
     "Kastrexana",
     "Arangoiti"
    ],
    "ans": 2,
    "info": "«Ribera del Cadagua» pertenece a Kastrexana.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Calzada medieval de Santa Águeda»?",
    "opts": [
     "Txurdinaga",
     "Kastrexana",
     "La Peña",
     "Iralabarri"
    ],
    "ans": 1,
    "info": "«Calzada medieval de Santa Águeda» está en Kastrexana.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Calzada medieval de Kastrexana»?",
    "opts": [
     "Kastrexana",
     "Ibarrekolanda",
     "Masustegi",
     "San Adrián"
    ],
    "ans": 0,
    "info": "«Calzada medieval de Kastrexana» pertenece a Kastrexana.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Kastrexana?",
    "opts": [
     "Ciudad Jardín",
     "Zazpikaleak",
     "Basurto",
     "Errekaldeberri"
    ],
    "ans": 2,
    "info": "Kastrexana y Basurto están en el distrito Basurtu-Zorrotza.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Miribilla",
     "Kastrexana",
     "Bilbao La Vieja",
     "San Francisco"
    ],
    "ans": 1,
    "info": "Kastrexana está en el distrito Basurtu-Zorrotza.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Kastrexana estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 1,
    "info": "Kastrexana no tiene estación de metro.",
    "tipo": "metroTF",
    "fuente": "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
    "fuenteTitulo": "Ayuntamiento de Bilbao: nomenclátor 2022"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Paso del Camino de Santiago»?",
    "opts": [
     "Artxanda",
     "Altamira",
     "Kastrexana",
     "Arabella"
    ],
    "ans": 2,
    "info": "«Paso del Camino de Santiago» está en Kastrexana.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Entorno del Puente del Diablo»?",
    "opts": [
     "Betolaza",
     "Santutxu",
     "Arabella",
     "Kastrexana"
    ],
    "ans": 3,
    "info": "«Entorno del Puente del Diablo» pertenece a Kastrexana.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Puente del Diablo, de un solo arco sobre el Cadagua»?",
    "opts": [
     "Errekalde",
     "Abando",
     "Basurtu-Zorrotza",
     "Deustu"
    ],
    "ans": 2,
    "info": "«Puente del Diablo, de un solo arco sobre el Cadagua» está en Kastrexana, distrito Basurtu-Zorrotza.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿En qué distrito se encuentra «Ribera del Cadagua»?",
    "opts": [
     "Errekalde",
     "Basurtu-Zorrotza",
     "Begoña",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 1,
    "info": "«Ribera del Cadagua» está en Kastrexana, distrito Basurtu-Zorrotza.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "San Pedro de Deusto",
     "Altamira",
     "Olabeaga",
     "Basurto"
    ],
    "ans": 0,
    "info": "San Pedro de Deusto no está en Basurtu-Zorrotza.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Kastrexana estación de tren de cercanías?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Kastrexana cuenta con estación de tren de cercanías.",
    "tipo": "trenTF",
    "fuente": "https://www.gronze.com/etapa/bilbao-bilbo/portugalete/recorrido",
    "fuenteTitulo": "Gronze"
   },
   {
    "q": "¿El hito «Puente del Diablo, de un solo arco sobre el Cadagua» está en Kastrexana?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Kastrexana.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿El hito «Iglesia de San Pedro de Deusto, gótico vasco y núcleo originario de la anteiglesia» está en Kastrexana?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, ese hito no está en Kastrexana.",
    "tipo": "tfHitoNo",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   },
   {
    "q": "¿El espacio «Ribera del Cadagua» está en Kastrexana?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, está en Kastrexana.",
    "tipo": "tfEspacioYes",
    "fuente": "https://es.wikipedia.org/wiki/Kastrexana",
    "fuenteTitulo": "Wikipedia: Kastrexana"
   }
  ]
 },
 {
  "nombre": "Gurtubay",
  "distrito": "Basurtu-Zorrotza",
  "lema": "El rincón del bacalao legendario",
  "pintxo": {
   "nombre": "Pintxo de bacalao confitado de Gurtubay",
   "ingrediente": "bacalao confitado",
   "color": "#d9c37a",
   "forma": 3
  },
  "fuentes": [
   "https://www.bilbaointermodal.eus/es/contacto.html",
   "https://www.bilbaoturismo.net/BilbaoTurismo/es/bus/bilbaointermodal",
   "https://www.viaja.tur4all.com/en/ficha/bilbao-station-intermodal-bus",
   "https://es.wikipedia.org/wiki/Basurto-Zorroza",
   "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
   "https://www.euskotren.eus/es/tranvia/bilbao",
   "https://www.bilbao.eus/ArchivoDigital/Nomenclatores/2022_esp.pdf",
   "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
   "https://www.bilbao.eus/bilbaoopendata/demografia/numero_habitantes_barrio_sexo_2023.csv"
  ],
  "preguntas": [
   {
    "q": "¿A qué distrito de Bilbao pertenece el barrio de Gurtubay?",
    "opts": [
     "Otxarkoaga-Txurdinaga",
     "Begoña",
     "Abando",
     "Basurtu-Zorrotza"
    ],
    "ans": 3,
    "info": "Gurtubay forma parte del distrito Basurtu-Zorrotza.",
    "tipo": "district",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué estación de metro da servicio a Gurtubay?",
    "opts": [
     "Abando (L1/L2)",
     "Deustu (L1/L2)",
     "Matiko (L3)",
     "Santimami/San Mamés (L1/L2)"
    ],
    "ans": 3,
    "info": "La estación de metro más próxima es Santimami/San Mamés (L1/L2).",
    "tipo": "metro",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cómo se accede principalmente al barrio de Gurtubay?",
    "opts": [
     "Tranvía · T1 Abusu",
     "Metro (Abando y Moyua)",
     "Metro, tranvía, tren y autobús",
     "Funicular de Artxanda y autobús"
    ],
    "ans": 2,
    "info": "Gurtubay: Metro, tranvía, tren y autobús. Metro, tranvía y tren en San Mamés; autobuses urbanos",
    "tipo": "access",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿Cuál de estos hitos es característico de Gurtubay?",
    "opts": [
     "Escuelas de Tomás Camacho (1921, Pedro Ispizua)",
     "Biblioteca de Bidebarrieta",
     "Escultura 'Minotauro' en el Parque de Europa",
     "Calle Gurtubay, acceso principal a Bilbao Intermodal"
    ],
    "ans": 3,
    "info": "«Calle Gurtubay, acceso principal a Bilbao Intermodal» es un hito de Gurtubay. Bilbao Intermodal se encuentra en la calle Gurtubay, 1, con accesos desde Luis Briñas y Pérez Galdós.",
    "tipo": "hitoId",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Calle Gurtubay, acceso principal a Bilbao Intermodal»?",
    "opts": [
     "San Ignacio",
     "Ametzola",
     "Gurtubay",
     "Zurbaran"
    ],
    "ans": 2,
    "info": "«Calle Gurtubay, acceso principal a Bilbao Intermodal» está en Gurtubay. Bilbao Intermodal se encuentra en la calle Gurtubay, 1, con accesos desde Luis Briñas y Pérez Galdós.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   },
   {
    "q": "¿Cuál de estas plazas o parques pertenece a Gurtubay?",
    "opts": [
     "Ladera verde de Santutxu",
     "Bilbao Intermodal",
     "Plaza de San Pedro",
     "Área deportiva de la plaza de la Encarnación"
    ],
    "ans": 1,
    "info": "«Bilbao Intermodal» está en Gurtubay.",
    "tipo": "espacioId",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Bilbao Intermodal»?",
    "opts": [
     "Ibarrekolanda",
     "Zorrotza",
     "Gurtubay",
     "Iturrigorri - Peñascal"
    ],
    "ans": 2,
    "info": "«Bilbao Intermodal» pertenece a Gurtubay.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Bilbao Intermodal, la gran estación de autobuses»?",
    "opts": [
     "Gurtubay",
     "San Francisco",
     "Santutxu",
     "Betolaza"
    ],
    "ans": 0,
    "info": "«Bilbao Intermodal, la gran estación de autobuses» está en Gurtubay.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   },
   {
    "q": "¿En qué barrio de Bilbao está «Entorno de la calle Gurtubay»?",
    "opts": [
     "Masustegi",
     "Bilbao La Vieja",
     "Gurtubay",
     "Monte Caramelo"
    ],
    "ans": 2,
    "info": "«Entorno de la calle Gurtubay» pertenece a Gurtubay.",
    "tipo": "espacioRev",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   },
   {
    "q": "¿Qué otro barrio pertenece al mismo distrito que Gurtubay?",
    "opts": [
     "Larraskitu",
     "Campuzano",
     "San Ignacio",
     "Basurto"
    ],
    "ans": 3,
    "info": "Gurtubay y Basurto están en el distrito Basurtu-Zorrotza.",
    "tipo": "sameDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Qué barrio pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Errekaldeberri",
     "Gurtubay",
     "Begoña",
     "Bolueta"
    ],
    "ans": 1,
    "info": "Gurtubay está en el distrito Basurtu-Zorrotza.",
    "tipo": "distritoRev",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Gurtubay estación de metro propia?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí: Santimami/San Mamés (L1/L2).",
    "tipo": "metroTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Santimami/San Mamés (L1/L2) da servicio a Gurtubay?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Santimami/San Mamés (L1/L2) es la estación de metro de Gurtubay.",
    "tipo": "metroStationTF",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿La estación de metro Deustu (L1/L2) da servicio a Gurtubay?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 0,
    "info": "No, Deustu (L1/L2) no es la estación de Gurtubay.",
    "tipo": "metroStationTFNo",
    "fuente": "https://cms.metrobilbao.eus/es/get/open_data/estaciones/es",
    "fuenteTitulo": "Metro Bilbao: datos de estaciones"
   },
   {
    "q": "¿En qué barrio de Bilbao se encuentra este hito: «Bilbao Intermodal, antes conocida como Termibus»?",
    "opts": [
     "Iturralde",
     "Betolaza",
     "Zurbaran",
     "Gurtubay"
    ],
    "ans": 3,
    "info": "«Bilbao Intermodal, antes conocida como Termibus» está en Gurtubay. La estación de autobuses de Bilbao fue conocida como Termibus antes de inaugurarse como Bilbao Intermodal en 2019.",
    "tipo": "hitoRev",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   },
   {
    "q": "¿En qué distrito se encuentra el hito «Calle Gurtubay, acceso principal a Bilbao Intermodal»?",
    "opts": [
     "Basurtu-Zorrotza",
     "Otxarkoaga-Txurdinaga",
     "Errekalde",
     "Uribarri"
    ],
    "ans": 0,
    "info": "«Calle Gurtubay, acceso principal a Bilbao Intermodal» está en Gurtubay, distrito Basurtu-Zorrotza. Bilbao Intermodal se encuentra en la calle Gurtubay, 1, con accesos desde Luis Briñas y Pérez Galdós.",
    "tipo": "hitoDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   },
   {
    "q": "¿En qué distrito se encuentra «Bilbao Intermodal»?",
    "opts": [
     "Basurtu-Zorrotza",
     "Uribarri",
     "Deustu",
     "Otxarkoaga-Txurdinaga"
    ],
    "ans": 0,
    "info": "«Bilbao Intermodal» está en Gurtubay, distrito Basurtu-Zorrotza.",
    "tipo": "espacioDistrito",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   },
   {
    "q": "¿Cuál de estos barrios NO pertenece al distrito Basurtu-Zorrotza?",
    "opts": [
     "Masustegi",
     "San Pedro de Deusto",
     "Olabeaga",
     "Kastrexana"
    ],
    "ans": 1,
    "info": "San Pedro de Deusto no está en Basurtu-Zorrotza.",
    "tipo": "notInDistrict",
    "fuente": "https://www.bilbao.eus/bilbaoencifras2011/1_2_8.asp",
    "fuenteTitulo": "Ayuntamiento de Bilbao: Bilbao en cifras"
   },
   {
    "q": "¿Tiene Gurtubay parada de tranvía?",
    "opts": [
     "No",
     "Sí"
    ],
    "ans": 1,
    "info": "Sí, Gurtubay cuenta con parada de tranvía.",
    "tipo": "tranviaTF",
    "fuente": "https://www.euskotren.eus/es/tranvia/bilbao",
    "fuenteTitulo": "Euskotren"
   },
   {
    "q": "¿El hito «Calle Gurtubay, acceso principal a Bilbao Intermodal» está en Gurtubay?",
    "opts": [
     "Sí",
     "No"
    ],
    "ans": 0,
    "info": "Sí, está en Gurtubay. Bilbao Intermodal se encuentra en la calle Gurtubay, 1, con accesos desde Luis Briñas y Pérez Galdós.",
    "tipo": "tfHitoYes",
    "fuente": "https://es.wikipedia.org/wiki/Basurto-Zorroza",
    "fuenteTitulo": "Wikipedia: Basurto-Zorroza"
   }
  ]
 }
];
