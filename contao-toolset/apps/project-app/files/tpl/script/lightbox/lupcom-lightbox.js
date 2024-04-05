$(function () {
    var lang = $('html').attr('lang');

    if(typeof getCookie !== 'function') {
        function setCookie(name, value, days) {
            var d = new Date;
            d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
            document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
        }
    }

    if(typeof getCookie !== 'function') {
        function getCookie(name) {
            var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
            return v ? v[2] : null;
        }
    }

    function checkForYoutubeInLightbox() {
        youtube_loaded = true;
        let youtubeFrame = $('.lightbox-content .iframe-container.youtube iframe'),
            youtubeSrc = youtubeFrame.data('src');

        if(youtubeSrc !== 'undefined') {
            youtubeFrame.attr('src', youtubeSrc);
        }
    }

    var offset = 0;
    $('body').append('<div class="lupcom-lightbox"><div class="inner"><div class="lightbox-content-wrapper bg-normal"><span class="close-box"></span><div class="lightbox-content"></div><p class="loader-holder"><span class="loader"><i class="bullet"></i><i class="bullet"></i><i class="bullet"></i><i class="bullet"></i></span></p></div></div></div>');
    $('body').on('click', '.lightbox', function (e) {
        if (window.innerWidth >= 768) {
            offset = $(document, window).scrollTop();
            $('html, body').css({'height': '100vh', 'overflow': 'hidden'});
            $('#wrapper').css({'margin-top': '-' + offset + 'px'});
        }
        e.preventDefault();
        var type = $(this).attr('data-lightbox');
        switch (type) {
            case "iframe":
                lightboxIframe($(this));
                break;
            case "youtube":
                lightboxYoutube($(this));
                break;
            case "ajax":
                lightboxAjax($(this));
                break;
            case "content":
                lightboxHiddenContent($(this));
                break;
            case "gallery":
                lightboxGallery($(this));
                break;
            default:
                lightboxAjax($(this));
                break;
        }
    });
    $('body').on('click', '.imagebox', function (e) {
        if (window.innerWidth >= 768) {
            offset = $(document, window).scrollTop();
            $('html, body').css({'height': '100vh', 'overflow': 'hidden'});
            $('#wrapper').css({'margin-top': '-' + offset + 'px'});
        }
        e.preventDefault();
        lightboxGallery($(this));
    });

    function lightboxClose() {
        $('body').on('click', '.lupcom-lightbox', function (e) {
            var clicked = $(e.target);
            if ((clicked[0].nodeName == 'DIV' && clicked.hasClass('inner')) || clicked.hasClass('close-box') && (clicked[0].nodeName != 'IMG' && clicked[0].nodeName != 'VIDEO' && !clicked.hasClass('playLBVideo') && !clicked.hasClass('slick-next') && !clicked.hasClass('slick-prev'))) {
                if (window.innerWidth >= 768) {
                    $('html, body').css({'height': 'initial', 'overflow': 'auto'});
                    $('#wrapper').css({'margin-top': '0px'});
                    $('html, body').scrollTop(offset);
                }
                $('.lupcom-lightbox').hide().removeClass('gallery');
                $('.lightbox-content').empty();
                if (typeof lightboxClosed == 'function') {
                    setTimeout(lightboxClosed, 200);
                }

                /*  */
            }
        });
    }

    function lightboxIframe(link) {
        var lightboxClass = link.attr('data-class');
        $('.lightbox-content').empty().addClass(lightboxClass).append("<div class='iframe-container'><iframe src='" + link.attr('href') + "' frameborder='0' allowfullscreen></iframe></div>").closest('.lupcom-lightbox').show();
        setTimeout($('.loader-holder').hide(), 200);
        if (typeof lightboxLoaded == 'function') {
            setTimeout(lightboxLoaded, 200);
        }
        lightboxClose();
    }

    function lightboxYoutube(link) {
        var youtube_loaded = false,
            lightboxClass = link.attr('data-class'),
            dsgvoText,
            buttonText;
        if(lang == 'de') {
            dsgvoText = 'Indem Sie das Video laden, akzeptieren Sie die <a href="https://policies.google.com/privacy?hl=de" target="_blank">Datenschutzerklärung</a> von google.de';
            buttonText = 'Video laden';
        } else {
            dsgvoText = 'By loading the video, you accept the <a href="https://policies.google.com/privacy?hl=en" target="_blank">privacy policy</a> of google.com';
            buttonText = 'load video';
        }
        var dsgvoContainer = '<div class="dsgvo"><p>' + dsgvoText + '</p><button class="load-video">' + buttonText + '</button></div>';
        $('.lightbox-content').empty().addClass(lightboxClass).append("<div class='iframe-container youtube'><iframe data-src='" + link.attr('href') + "?rel=0&autoplay=1&modestbranding=1&showinfo=0' frameborder='0' allowfullscreen allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'></iframe></div>").closest('.lupcom-lightbox').addClass('gallery');
        $('.lightbox-content .iframe-container').prepend(dsgvoContainer);
        $('.lupcom-lightbox').show();
        setTimeout($('.loader-holder').hide(), 200);
        if (typeof lightboxLoaded == 'function') {
            setTimeout(lightboxLoaded, 200);
        }
        if ((getCookie('dsgvo') == 1 || getCookie('lupcom_cookie_switch-marketing') == 1) && !youtube_loaded) {
            $('.lightbox-content .dsgvo').fadeOut();
            checkForYoutubeInLightbox();
        } else {
            $('.lightbox-content .dsgvo').fadeIn();
        }
        $('body').on('click', '.lightbox-content .load-video', function () {
            $('.lightbox-content .dsgvo').fadeOut();
            setCookie('dsgvo', 1, 30);
            checkForYoutubeInLightbox();
        });

        lightboxClose();
    }

    function lightboxHiddenContent(link) {
        var lightboxClass = link.attr('data-class');
        $('.lightbox-content').empty().addClass(lightboxClass).append($(link.attr('href')).clone()).closest('.lupcom-lightbox').show();
        $('.loader-holder').hide();
        if (typeof lightboxLoaded == 'function') {
            setTimeout(lightboxLoaded, 200);
        }
        lightboxClose();
    }

    function lightboxAjax(link) {
        var lightboxClass = link.attr('data-class');
        var toLoad = link.attr('href');
        var hash = link.prop('hash');
        if (!hash) {
            hash = '.ajax-content';
        }
        if (link.attr('data-selector')) {
            hash = ' .' + link.attr('data-selector');
        }
        $('.lightbox-content').hide();
        $('.lupcom-lightbox').show();
        $('.loader-holder').show();
        $.ajax({
            type: 'post',
            url: toLoad + "?ajax=true",
            async: true
        }).done(function (data) {
            if (data) {
                var success = $($.parseHTML(data, true)).find(hash);
                $('.lightbox-content').empty().addClass(lightboxClass).html(success);
                $('.loader-holder').hide();
                $('.lightbox-content').show();
                if (typeof ajaxLoadedScript == 'function') {
                    setTimeout(ajaxLoadedScript, 900);
                }
                if (typeof lightboxLoaded == 'function') {
                    setTimeout(lightboxLoaded, 500);
                }
            }
        });
        lightboxClose();
    }

    function lightboxGallery(link) {
        $('.lightbox-content').hide();
        $('.lupcom-lightbox').addClass('gallery').show();
        $('.loader-holder').show();
        var galleryItems = $('a[data-rel="' + $(link).attr('data-rel') + '"]');
        var strGallery = '<div id="lightbox_slider" class="swiper-inner">';
        var first = galleryItems.index($(link));
        var lightboxClass = link.attr('data-class');
        var video = false;
        if (!first) {
            first = 0;
        }
        galleryItems.each(function (index) {
            var href = $(this).attr('data-src');
            var share = encodeURI($(this).attr('href'));
            if (!href) {
                href = $(this).attr('href');
                share = "";
            }
            if (href.search('#') == -1) {
                if ($(this).attr('data-video')) {
                    var video_container = ' class="video_container"';
                } else {
                    var video_container = '';
                }
                var caption = $(this).attr('data-text');
                var str = '<div' + video_container + '><figure><img src="' + href + '" alt="' + $(this).attr('title') + '" />';
                if (share && $(this).attr('title')) {
                    str += '<figcaption><div class="ce_socialmediabar share block"><div class="s-buttons"><a href="https://www.facebook.com/sharer/sharer.php?u=' + share + '&amp;t=' + $(this).children().attr('alt') + '" rel="nofollow" title="Share on Facebook" onclick="window.open(this.href, \'\', \'width=640,height=380,modal=yes,left=100,top=50,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no\'); return false" class="s-facebook">auf Facebook teilen</a></div></div></figcaption>';
                } else if ($(this).attr('title')) {
                    str += '<figcaption class="caption"><p>' + $(this).attr('title') + '</p>';
                    if (caption) {
                        str += '<p>' + caption + '</p>';
                    }
                    str += '</figcaption>';
                }
                if ($(this).attr('data-video')) {
                    if (isJson($(this).attr('data-video'))) {
                        var videoSrc = findVideoSrc(JSON.parse($(this).attr('data-video')));
                    } else {
                        var videoSrc = $(this).attr('data-video');
                    }
                    video = true;
                    str += '<video playsinline controls preload="none" class="lightbox_videos"><source src="' + videoSrc + '" type="video/mp4"></video><span class="playLBVideo"></span>'
                }
                str += '</figure></div>';
                strGallery += str;
            } else {
                first = 0;
            }
        });
        strGallery += "</div>";

        $('.lightbox-content').empty().addClass(lightboxClass).html(strGallery);

        function loadSlider() {
            $('.lightbox-content').show();
            $('#lightbox_slider').slick({
                dots: false,
                arrows: true,
                autoplay: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplaySpeed: 3000,
                adaptiveHeight: false,
                initialSlide: first,
                easing:'_default',
                respondTo: 'min'
            });
            $('.loader-holder').hide();
            $('#lightbox_slider').css({'opacity': 1});
            $('#lightbox_slider').init(function () {
                $('#lightbox_slider').slick('setPosition');
            });
            if (video) {
                $('body').on('click', 'span.playLBVideo', function () {
                    var video = $(this).parent().find('video');
                    video.addClass('playing')[0].play();
                    $(this).parent().addClass('playing');
                    video[0].onended = function () {
                        video.removeClass('playing');
                        $(this).parent().removeClass('playing');
                    }
                });
                $('#lightbox_slider').on('afterChange', function () {
                    $('#lightbox_slider').find('video').each(function () {
                        this.pause();
                        $(this).removeClass('playing');
                        $(this).parent().removeClass('playing');
                    });
//                        $(this).slick('slickPlay');
                });
                if (galleryItems.length = 1) {
                    $('#lightbox_slider').find('video').addClass('playing')[0].play();
                    $('#lightbox_slider').find('video').parent().addClass('playing');
                }
            }
        }

        $('.lightbox-content img').each(function (e) {
            if (e == first) {
                $(this).load($(this).attr('src'), function () {
                    setTimeout(loadSlider, 200);
                });
            }
        });
        if (typeof lightboxLoaded == 'function') {
            setTimeout(lightboxLoaded, 200);
        }
        lightboxClose();
    }

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function findVideoSrc(videoSrc) {
        var viewPortWidth = window.innerWidth;
        var video = "";
        if (viewPortWidth <= 640) {
            video = videoSrc.sd_640;
        } else if (viewPortWidth <= 960) {
            video = videoSrc.sd_960;
        } else if (viewPortWidth <= 1280) {
            video = videoSrc.hd_1280;
        } else {
            video = videoSrc.hd_1920;
        }
        if (!video) {
            video = Object.keys(videoSrc)[0];
        }
        return video;
    }

});
