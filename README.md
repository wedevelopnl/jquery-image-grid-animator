jquery-image-grid-animator
==========================

jQuery plugin; turns a list of images into a grid with hover animations

```html
<ul class="gridify">
    <li><img src="img/chrysanthemum.jpg" /></li>
    <li data-height="2" data-right="2" data-down="0"><img src="img/tulips.jpg" /></li>
    <li>
        <ul>
            <li data-down="0" data-right="1" data-width="2" data-height="1"><img src="img/tulips.jpg" /></li>
            <li data-left="1" data-down="1" data-width="1" data-height="1"><img src="img/chrysanthemum.jpg" /></li>
        </ul>
        <ul>
            <li data-right="2" data-up="1" data-width="1" data-height="1"><img src="img/penguins.jpg" /></li>
            <li data-up="2" data-left="0" data-width="2" data-height="1"><img src="img/koala.jpg" /></li>
        </ul>
    </li>
    <li><img src="img/chrysanthemum.jpg" /></li>
</ul>

<script type="text/javascript">
    $(document).ready(function() {
        $('.gridify').imageGridify();
    });
</script>
```

