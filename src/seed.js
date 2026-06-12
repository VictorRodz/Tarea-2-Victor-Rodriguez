import db from './db.js';
import { mundialSchema } from './schemas.js';

const mundiales = [
  {
    nombre: "Copa Mundial Uruguay 1930",
    anio: 1930,
    sede: "Uruguay",
    campeon: "Uruguay",
    subcampeon: "Argentina",
    goleador: "Guillermo Stabile",
    equipos: 13,
    imagen: "uruguay-1930.avif",
    slug: "uruguay-1930",
    resumen: "Primer Mundial de la historia, Uruguay campeon en casa.",
    descripcion: "El torneo inaugural se jugo enteramente en Montevideo, con Uruguay venciendo a Argentina en la final por 4 a 2."
  },
  {
    nombre: "Copa Mundial Brasil 1950",
    anio: 1950,
    sede: "Brasil",
    campeon: "Uruguay",
    subcampeon: "Brasil",
    goleador: "Ademir",
    equipos: 13,
    imagen: "brasil-1950.avif",
    slug: "brasil-1950",
    resumen: "El Maracanazo: Uruguay sorprende a Brasil en su propia casa.",
    descripcion: "Disputado bajo formato de todos contra todos en la fase final, Uruguay derroto a Brasil 2-1 en el Maracana ante 200 mil espectadores."
  },
  {
    nombre: "Copa Mundial Inglaterra 1966",
    anio: 1966,
    sede: "Inglaterra",
    campeon: "Inglaterra",
    subcampeon: "Alemania Occidental",
    goleador: "Eusebio",
    equipos: 16,
    imagen: "inglaterra-1966.avif",
    slug: "inglaterra-1966",
    resumen: "Inglaterra gana su unico titulo mundial como local.",
    descripcion: "La final ante Alemania Occidental se decidio en tiempo extra con un controvertido gol de Geoff Hurst, terminando 4-2."
  },
  {
    nombre: "Copa Mundial Argentina 1978",
    anio: 1978,
    sede: "Argentina",
    campeon: "Argentina",
    subcampeon: "Holanda",
    goleador: "Mario Kempes",
    equipos: 16,
    imagen: "argentina-1978.avif",
    slug: "argentina-1978",
    resumen: "Argentina conquista su primer titulo mundial en casa.",
    descripcion: "Con Mario Kempes como figura y goleador del torneo, Argentina vencio a Holanda 3-1 en la final disputada en el Monumental."
  },
  {
    nombre: "Copa Mundial Francia 1998",
    anio: 1998,
    sede: "Francia",
    campeon: "Francia",
    subcampeon: "Brasil",
    goleador: "Davor Suker",
    equipos: 32,
    imagen: "francia-1998.avif",
    slug: "francia-1998",
    resumen: "Francia se consagra campeon del mundo por primera vez.",
    descripcion: "Con goles de Zinedine Zidane, Francia goleo 3-0 a Brasil en la final disputada en el Stade de France, el primero con 32 equipos."
  },
  {
    nombre: "Copa Mundial Qatar 2022",
    anio: 2022,
    sede: "Qatar",
    campeon: "Argentina",
    subcampeon: "Francia",
    goleador: "Kylian Mbappe",
    equipos: 32,
    imagen: "qatar-2022.avif",
    slug: "qatar-2022",
    resumen: "Argentina campeon tras una final epica ante Francia.",
    descripcion: "Primer Mundial en Medio Oriente; Argentina gano en penales su tercer titulo."
  }
];

const insert = db.prepare(`
  INSERT OR REPLACE INTO mundiales
  (nombre, anio, sede, campeon, subcampeon, goleador, equipos, imagen, slug, resumen, descripcion)
  VALUES (@nombre, @anio, @sede, @campeon, @subcampeon, @goleador, @equipos, @imagen, @slug, @resumen, @descripcion)
`);

db.exec('DELETE FROM mundiales');

const insertMany = db.transaction((items) => {
  for (const item of items) {
    const validado = mundialSchema.parse(item);
    insert.run(validado);
  }
});

insertMany(mundiales);

console.log(`Se insertaron ${mundiales.length} mundiales correctamente.`);