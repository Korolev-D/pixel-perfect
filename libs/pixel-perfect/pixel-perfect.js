class PixelPerfect{
    widthImage;
    heightImage;
    opacityImage;
    $items;
    $image;

    constructor(section, path = ""){
        this.$section = $(section);
        this.$body = $("body");
        this.widthImage = Number(localStorage.getItem("WIDTH_IMAGE"));
        this.heightImage = Number(localStorage.getItem("HEIGHT_IMAGE"));
        this.opacityImage = Number(localStorage.getItem("OPACITY_IMAGE"));
        this.$body.html(this.$section);

        $.ajax({
            url: `${path}/libs/pixel-perfect/ajax.php`,
            method: "POST",
            success: (data) => {
                this.$section.css({"position": "relative"});
                this.$body.append(`
                    <div class="pixel-perfect">
                        <div class="pixel-perfect__settings js-pixel-perfect-settings">
                            <input type="range" id="opacity" name="opacity" min="0" max="100" step="1">
                            <label for="opacity">opacity</label>
                        </div>
                        <div class="pixel-perfect__items js-pixel-perfect-items"></div>
                        <button class="pixel-perfect__control js-pixel-perfect-control">
                            <span>Открыть</span>
                        </button>
                    </div>
                `);
                this.$section.append(`<div class="pixel-perfect__image js-pixel-perfect-image"></div>`);
                this.$items = this.$body.find(".js-pixel-perfect-items");
                this.$image = this.$body.find(".js-pixel-perfect-image");
                $(JSON.parse(data).images).each((index, item) => {
                    this.$items.append(`
                        <button class="pixel-perfect__item js-pixel-perfect-item" data-width="${item.WIDTH}" data-height="${item.HEIGHT}" data-src="${item.SRC}">${item.WIDTH} x ${item.HEIGHT}</button>
                    `);
                });
            }
        }).then(
            (data) => {
                let $item = this.$body.find(".js-pixel-perfect-item"),
                    $control = this.$body.find(".js-pixel-perfect-control"),
                    $settings = this.$body.find(".js-pixel-perfect-settings"),
                    $range = this.$body.find(".js-pixel-perfect-settings input");

                if (this.widthImage && this.heightImage) {
                    $control.html(`${this.widthImage} x ${this.heightImage}`);
                }

                $item.each((index, item) => {
                    let $item = $(item),
                        height = $item.data("height"),
                        width = $item.data("width"),
                        src = $item.data("src");

                    if (width === this.widthImage && height === this.heightImage) {
                        $item.addClass("active");
                        this.$image.html(`<img src="${src}" alt="pixel-perfect-image">`);
                    }
                });

                if(this.opacityImage){
                    $range.val(this.opacityImage);
                    this.$image.css({"opacity": `${this.opacityImage}%`});
                    this.opacityImage === 0 ? this.$image.hide() : this.$image.show();
                }

                $control.on("click", () => {
                    this.widthImage = localStorage.getItem("WIDTH_IMAGE");
                    this.heightImage = localStorage.getItem("HEIGHT_IMAGE");
                    $control.toggleClass("open");
                    this.$items.toggleClass("flex");
                    $settings.toggleClass("flex");
                    if ($control.hasClass("open")) {
                        $control.html("Закрыть");
                    } else if (this.widthImage && this.heightImage) {
                        $control.html(`${this.widthImage} x ${this.heightImage}`);
                    } else {
                        $control.html("Открыть");
                    }
                });

                $item.on("click", (e) => {
                    e = e.originalEvent;
                    let $this = $(e.target),
                        height = $this.data("height"),
                        width = $this.data("width"),
                        src = $this.data("src");

                    if (width !== Number(localStorage.getItem("WIDTH_IMAGE"))) {
                        $item.removeClass("active");
                        this.$image.html("");
                    }
                    if ($this.hasClass("active")) {
                        localStorage.setItem("WIDTH_IMAGE", "");
                        localStorage.setItem("HEIGHT_IMAGE", "");
                        this.$image.html("");
                    } else {
                        localStorage.setItem("WIDTH_IMAGE", `${width}`);
                        localStorage.setItem("HEIGHT_IMAGE", `${height}`);
                        this.$image.html(`<img src="${src}" alt="pixel-perfect-image">`);
                    }
                    $this.toggleClass("active");
                });

                $range.on("input", (e) => {
                    e = e.originalEvent;
                    let opacity = Number($(e.target).val());
                    localStorage.setItem("OPACITY_IMAGE", `${opacity}`);
                    this.$image.css({"opacity": `${opacity}%`});
                    opacity === 0 ? this.$image.hide() : this.$image.show();
                });
            }
        );
    }
}