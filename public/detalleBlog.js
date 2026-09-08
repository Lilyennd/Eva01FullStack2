
const parametros = new URLSearchParams(window.location.search);
const idBlog = parametros.get('id');

const elTitulo = document.getElementById('Titulo');
const elImagen = document.getElementById('Imagen');
const elContenido = document.getElementById('Contenido');


const blogsInformacion = {
  "1": {
    titulo: "💎 ¿Joyas en las uñas? La nueva tendencia de lujo de 2026",
    imagen: "diamantes-para-uñas.webp",
    contenidoHtml: `
      <p class="lead fw-bold">Diamantes, piedras preciosas y detalles de alta joyería están dejando de ser exclusivos de anillos y collares para convertirse también en protagonistas de la manicura. Descubre cómo esta llamativa tendencia está uniendo el mundo de la belleza con el lujo y la joyería.</p>
      
      <h3>Las joyas también llegaron a las uñas</h3>
      <p>Durante 2026, el mundo de la moda y la belleza continúa sorprendiendo con nuevas formas de incorporar las joyas al estilo personal. Una de las tendencias más llamativas es la decoración de uñas con diamantes, cristales, perlas y pequeñas piedras preciosas, transformando la manicura tradicional en verdaderas piezas de lujo.</p>
      <p>Aunque decorar las uñas con pequeños accesorios no es algo completamente nuevo, esta tendencia ha evolucionado hacia diseños mucho más sofisticados. Actualmente, algunas manicuras buscan imitar la apariencia de anillos, pulseras y otras piezas de alta joyería, utilizando piedras cuidadosamente seleccionadas y detalles metálicos para conseguir un resultado elegante y llamativo.</p>

      <h3>Del salón de belleza a la alta joyería</h3>
      <p>La combinación entre joyería y manicura ha ganado atención especialmente en eventos de moda, celebraciones y ocasiones especiales. Los diseños pueden incluir desde pequeños cristales colocados estratégicamente hasta composiciones más elaboradas con diferentes piedras y elementos metálicos.</p>
      <p>En las versiones más exclusivas, los diseños pueden llegar a utilizar diamantes y piedras preciosas reales, convirtiendo cada uña en una pequeña pieza de joyería. Algunas propuestas de alta gama pueden alcanzar valores de miles de dólares por dedo, dependiendo de las piedras utilizadas, su tamaño y la complejidad del diseño.</p>
      <p>Esto demuestra cómo la joyería ya no se limita solamente a los accesorios tradicionales. Actualmente, también puede formar parte de la expresión personal a través de la moda, la belleza y el diseño.</p>

      <h3>Una tendencia para quienes buscan destacar</h3>
      <p>Una de las características principales de esta tendencia es la posibilidad de personalizar completamente el diseño. Algunas personas prefieren una manicura discreta con una pequeña piedra en una sola uña, mientras que otras optan por diseños más llamativos que combinan diferentes tipos de piedras, colores y formas.</p>
      <p>Los tonos dorados y plateados continúan siendo una opción popular, pero también se pueden incorporar piedras de diferentes colores para crear diseños únicos. Esmeraldas, rubíes, zafiros y otras piedras pueden inspirar combinaciones que recuerdan a las piezas clásicas de alta joyería.</p>

      <h3>La inspiración detrás de la tendencia</h3>
      <p>Esta nueva forma de llevar joyas está relacionada con una idea cada vez más presente en la moda: los accesorios también pueden ser una forma de expresión personal.</p>
      <p>Así como un anillo puede representar elegancia, una pulsera puede complementar un atuendo o unos pendientes pueden convertirse en el centro de atención de un look, una manicura decorada con piedras puede aportar un detalle diferente y sofisticado.</p>
      <p>Para una tienda de joyas, esta tendencia también representa una oportunidad para mostrar que las piedras preciosas y los metales pueden inspirar mucho más que las piezas tradicionales. El diseño, la creatividad y la personalidad permiten encontrar nuevas maneras de apreciar la belleza de una joya.</p>

      <h3>¿Te atreverías a llevar joyas en tus uñas?</h3>
      <p>La tendencia de las uñas con joyería demuestra que el mundo del lujo continúa buscando nuevas formas de sorprender. Desde pequeños detalles brillantes hasta diseños completamente cubiertos de piedras, las posibilidades son prácticamente infinitas.</p>
      <p>Y aunque no sea necesario gastar miles de dólares para probar esta tendencia, una pequeña piedra, un cristal o un detalle inspirado en una joya puede transformar por completo una manicura.</p>
      <p><strong>¿Usarías una manicura con diamantes o piedras preciosas?</strong></p>
      <p>En el mundo de la joyería, cada detalle cuenta, y quizás ahora la próxima pieza que quieras lucir no esté en tu cuello, muñeca o dedo… sino en tus uñas.</p>
    `
  },
  "2": {
    titulo: "🐶💎 ¿Joyas para tu mejor amigo? La nueva tendencia de collares con diamantes",
    imagen: "collar_de_diamantes.jpg",
    contenidoHtml: `
      <p class="lead fw-bold">El lujo también está llegando al mundo de las mascotas. Collares decorados con cristales, piedras preciosas y detalles inspirados en la alta joyería se están convirtiendo en un accesorio llamativo para quienes quieren que sus perros luzcan con estilo.</p>
      
      <h3>Los perros también se suman a la tendencia de la joyería</h3>
      <p>En los últimos años, las mascotas han adquirido un papel cada vez más importante en el mundo de la moda. Y durante 2026, esta tendencia ha dado un paso más: los accesorios para perros también comienzan a incorporar elementos propios de la joyería.</p>
      <p>Collares con detalles dorados, cristales, perlas, piedras brillantes e incluso diseños con diamantes se han convertido en una alternativa para quienes buscan un accesorio diferente y sofisticado para sus mascotas.</p>
      <p>La idea no es solamente colocar una joya sobre un collar tradicional, sino crear piezas que combinen diseño, elegancia y personalidad, haciendo que el collar sea parte del look del perro.</p>

      <h3>Del accesorio tradicional a una pieza de lujo</h3>
      <p>Durante mucho tiempo, los collares para perros estuvieron pensados principalmente para cumplir una función práctica. Sin embargo, hoy también pueden convertirse en un elemento de moda.</p>
      <p>Algunos diseños incorporan pequeñas piedras brillantes o cristales para conseguir un efecto elegante sin que el accesorio sea demasiado llamativo. Otros apuestan por diseños más exclusivos, utilizando materiales y detalles inspirados en la alta joyería.</p>
      <p>En las propuestas de lujo pueden encontrarse collares personalizados con oro, piedras preciosas y diamantes, cuyos precios pueden aumentar considerablemente dependiendo de los materiales utilizados y del nivel de personalización.</p>

      <h3>Una joya que también puede ser personalizada</h3>
      <p>Una de las características más interesantes de esta tendencia es la personalización. El collar puede diseñarse pensando en el tamaño, color y personalidad de cada mascota.</p>
      <p>Por ejemplo, un collar puede incorporar una pequeña placa con el nombre del perro, un detalle con sus iniciales o una piedra que combine con su pelaje. También existen diseños más sencillos que utilizan pequeños cristales para aportar brillo sin perder la comodidad.</p>
      <p>De esta manera, el accesorio deja de ser solamente un collar y puede convertirse en una pieza única creada especialmente para cada mascota.</p>

      <h3>¿Diamantes reales o detalles brillantes?</h3>
      <p>No todos los collares de lujo utilizan diamantes reales. Existen alternativas con cristales y piedras decorativas que permiten conseguir una apariencia similar sin llegar al valor de una pieza elaborada con piedras preciosas.</p>
      <p>Para quienes buscan exclusividad, los diamantes y otras piedras preciosas pueden utilizarse como pequeños detalles dentro del diseño. En estos casos, es especialmente importante que la pieza esté correctamente elaborada y que los elementos decorativos se encuentren firmemente sujetos.</p>

      <h3>La importancia de la comodidad y seguridad</h3>
      <p>Aunque la estética es importante, cuando hablamos de accesorios para mascotas la comodidad debe ser siempre una prioridad.</p>
      <p>Un collar decorado con joyas debe tener un tamaño adecuado para el perro, no ser excesivamente pesado y estar fabricado de manera que los elementos decorativos no representen un riesgo.</p>
      <p>Por eso, los diseños más sofisticados deben buscar un equilibrio entre lujo, resistencia y comodidad, para que la mascota pueda utilizar su accesorio sin problemas.</p>

      <h3>Una tendencia que une mascotas y joyería</h3>
      <p>La aparición de estos accesorios demuestra cómo la joyería está encontrando nuevas formas de incorporarse a nuestra vida cotidiana. Las joyas ya no solamente acompañan nuestros propios looks: también pueden convertirse en una forma de celebrar el vínculo que tenemos con nuestras mascotas.</p>
      <p>Desde un pequeño detalle brillante hasta un collar completamente personalizado, existen opciones para diferentes estilos y presupuestos.</p>

      <h3>¿Le pondrías una joya a tu perro?</h3>
      <p>Los collares decorados con piedras y detalles inspirados en la joyería son una muestra de cómo la moda, el lujo y el mundo de las mascotas pueden combinarse para crear accesorios originales.</p>
      <p>Para algunos será simplemente un detalle elegante; para otros, una manera especial de demostrar cuánto significa su mascota.</p>
      <p>Porque si nuestros mejores amigos forman parte de nuestra vida, ¿por qué no podrían formar parte también de nuestro estilo?</p>
    `
  }
};

// 3. Renderizar el contenido según la ID recibida en la URL
if (idBlog && blogsInformacion[idBlog]) {
  const blogSeleccionado = blogsInformacion[idBlog];

  elTitulo.textContent = blogSeleccionado.titulo;
  elImagen.src = 'img/' + blogSeleccionado.imagen;
  elImagen.alt = blogSeleccionado.titulo;
  elContenido.innerHTML = blogSeleccionado.contenidoHtml;
} else {
  elTitulo.textContent = 'Blog no encontrado';
  elContenido.innerHTML = '<p class="text-danger">El artículo solicitado no existe o no se ha encontrado.</p>';
}