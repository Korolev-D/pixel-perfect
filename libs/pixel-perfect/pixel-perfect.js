class PixelPerfect{
    buttonOpenClose;
    buttonExtension;

    constructor(section, path = ""){
        this.$section = $(section);
        this.$body = $("body");
        this.$body.html(this.$section);

        $.ajax({
            url: `${path}/libs/pixel-perfect/ajax.php`,
            method: "POST",
            success: (data) => {
                this.$section.css({"position": "relative"});
                this.$body.append(`
                    <div class="pixel-perfect">
                        <span>PixelPerfect</span>
                        <div class="pixel-perfect__control">
                            <button class="btn btn-success js-pixel-perfect-control-open-close">Открыть</button>
                        </div>
                    </div>
                `);
                this.$section.append(`<div class="pixel-perfect__image js-pixel-perfect-image"></div>`);
                let $pixelPerfectControl = this.$body.find(".pixel-perfect__control");
                $(JSON.parse(data).images).each((index, item) => {
                    $pixelPerfectControl.append(`
                        <button class="btn btn-secondary js-pixel-perfect-control-extension" data-src="${item.SRC}">${item.WIDTH} x ${item.HEIGHT}</button>
                    `);
                });
            }
        }).then(
            (data) => {
                this.buttonOpenClose = this.$body.find(".js-pixel-perfect-control-open-close");
                this.buttonExtension = this.$body.find(".js-pixel-perfect-control-extension");
                this.buttonOpenClose.on("click", () => {
                    if(this.buttonOpenClose.hasClass("btn-success")){
                        this.buttonOpenClose.removeClass("btn-success");
                        this.buttonOpenClose.addClass("btn-danger");
                        this.buttonOpenClose.html("Закрыть");
                        $(".pixel-perfect span").show();
                        this.buttonExtension.addClass("d-flex");
                    }else{
                        this.buttonOpenClose.addClass("btn-success");
                        this.buttonOpenClose.removeClass("btn-danger");
                        this.buttonOpenClose.html("Открыть");
                        $(".pixel-perfect span").hide();
                        this.buttonExtension.removeClass("d-flex");
                    }
                });
                this.buttonExtension.on("click", (e) => {
                    e = e.originalEvent;
                    let $this = $(e.target);
                    this.buttonExtension.addClass("btn-secondary").removeClass("btn-outline-secondary");

                    if($this.hasClass("on")){
                        $this.removeClass("on");
                        $this.removeClass("btn-outline-secondary");
                        $this.addClass("btn-secondary");
                        this.$body.find(".pixel-perfect__image").html("");
                    }else{
                        $this.addClass("on");
                        $this.removeClass("btn-secondary");
                        $this.addClass("btn-outline-secondary");
                        this.$body.find(".pixel-perfect__image").html(`
                            <img src="${$this.data("src")}" alt="pixel-perfect-image" >
                        `);
                    }
                });
            }
        );
    }
}