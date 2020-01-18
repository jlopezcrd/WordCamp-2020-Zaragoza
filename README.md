    # WordCamp-2020-Zaragoza
Taller de voz en la web para el WordCamp 2020 en Zaragoza

# Configurar plantilla de WordPress

Añadir al header de la plantilla:

```html
<link rel="stylesheet" id="dashicons-css" href="/wp-content/themes/storefront/wordcamp.css" type="text/css" media="all">
```

Añadir al footer de la plantilla:

```html
<script src="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.js"></script>
<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>

<div id="mic"><i class="fas fa-microphone"></i></div>

<script src="/wp-content/themes/storefront/wordcamp.js"></script>
```
