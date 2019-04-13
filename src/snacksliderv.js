/**
 * @overview Simple video slider Class
 * last modified : 2019.04.13
 * @author Seungho.Yi <rh22sh@gmail.com>
 * @package SnackSliderV
 * @Version 1.0.3
 * @license MIT
 * @see https://github.com/rheesh/SnackSliderV
 */

class SnackSliderV {

    constructor(options){
        const opt = {
            mode: 'right',
            speed: 1000,
            fit: 'cover',
            muted: false,
            poster: '',
            width: 0,
            height: 0,
            children: [],
        };
        let {selector, mode, speed, fit, muted, poster, width, height, children} = options;
        this.flag = 0;
        this._selector = selector;
        this._mode = mode;
        this.speed = speed;
        this._muted = muted;
        this._poster = poster;
        this._fit = fit;
        this._width = width;
        this._height = height;
        this._current = 0;
        this.wrapper = $(selector);
        this.viewport = null;
        this.video = [ null, null ];
        this.children = Array.from(children);
        this.worker = false;
        this.play = this.play.bind(this);
        this.setNextCss = this.setNextCss.bind(this);
        this.build();
    }

    get selector() {
        return this._selector;
    }

    set selector(value) {
        let flag = this.worker;
        if(flag) this.stop();
        this.viewport = this.viewport.detach();
        this._selector = value;
        this.viewport.appendTo(this.selector);
        this.wrapper = $(this.selector);
        if(this._width === 0 || this.height === 0){
            this.viewport.css({
                width: this.width,
                height: this.height,
            });
        }
        if(flag) this.start();
    }

    get length(){
        return this.children.length;
    }

    get mode() {
        return this._mode;
    }
    set mode(value) {
        this._mode = value;
        this.setNextCss();
    }

    get muted() {
        return this._muted;
    }
    set muted(value) {
        this._muted = value;
        this.video[0].get(0).muted = this._muted;
        this.video[1].get(0).muted = this._muted;
    }

    get fit() {
        return this._fit;
    }
    set fit(value) {
        this._fit = value;
        this.viewport.children('video').css('object-fit', this.fit);
    }


    get poster() {
        return this._poster;
    }
    set poster(value) {
        this._poster = value;
        this.video[0].attr("poster", this._poster);
        this.video[1].attr("poster", this._poster);
    }

    get(idx){
        return this.children[idx];
    }
    set(idx, url){
        this.children[idx] = url;
    }

    add(idx, url){
        this.children.push(url);
    }

    insert(idx, url){
        this.children.splice(idx, 0, url);
    }
    delete(idx){
        this.children.splice(idx, 1);
    }


    get current(){
        if(this._current >= this.length)
            this._current = 0;
        const child = this.children[this._current];
        this._current++;
        if(this._current >= this.length)
            this._current = 0;
        return child;
    }

    get width(){
        if(this._width === 0){
            return this.wrapper.width();
        }
        return this._width;
    }
    set width(value) {
        this._width = value;
        this.viewport.css('width', this.width);
        this.viewport.children('video').css('width', this.width);
    }

    get height(){
        if(this._height === 0){
            return this.wrapper.height();
        }
        return this._height;
    }
    set height(value) {
        this._height = value;
        this.viewport.css('height', this.height);
        this.viewport.children('video').css('height', this.height);
    }

    //total play time (s)
    duration(idx){
        if(idx === undefined)
            return this.video[this.flag].get(0).duration;
        return this.video[idx].get(0).duration;
    }
    /*
     * 0 = HAVE_NOTHING - no information whether or not the video is ready
     * 1 = HAVE_METADATA - metadata for the video is ready
     * 2 = HAVE_CURRENT_DATA - data for the current playback position is available, but not enough data to play next frame/millisecond
     * 3 = HAVE_FUTURE_DATA - data for the current and at least the next frame is available
     * 4 = HAVE_ENOUGH_DATA - enough data available to start playing
     */
    readyState(idx){
        if(idx === undefined)
            return this.video[this.flag].get(0).readyState;
        return this.video[idx].get(0).readyState;
    }
    /* returns a TimeRanges object.
     * length - get the number of played ranges in the video
     * start(index) - get the start position of a played range
     * end(index) - get the end position of a played range
     */
    played(idx){
        if(idx === undefined)
            return this.video[this.flag].get(0).played;
        return this.video[idx].get(0).played;
    }
    //returns the current position (in seconds) of the video playback.
    currentTime(idx){
        if(idx === undefined)
            return this.video[this.flag].get(0).currentTime;
        return this.video[idx].get(0).currentTime;
    }
    //returns whether the video is paused.
    paused(idx){
        if(idx === undefined)
            return this.video[this.flag].get(0).paused;
        return this.video[idx].get(0).paused;
    }
    //whether the playback of the video has ended.
    ended(idx){
        if(idx === undefined)
            return this.video[this.flag].get(0).ended;
        return this.video[idx].get(0).ended;
    }
    /* returns a MediaError object.
     * 1 = MEDIA_ERR_ABORTED - fetching process aborted by user
     * 2 = MEDIA_ERR_NETWORK - error occurred when downloading
     * 3 = MEDIA_ERR_DECODE - error occurred when decoding
     * 4 = MEDIA_ERR_SRC_NOT_SUPPORTED - video not supported
     */
    error(idx){
        if(idx === undefined)
            return this.video[this.flag].get(0).error;
        return this.video[idx].get(0).error;
    }

    get transformValue(){
        switch(this.mode){
            case 'right':
                return "translateX(-" + this.width + "px)";
            case 'left':
                return "translateX(" + this.width + "px)";
            case 'top':
                return "translateY(" + this.height + "px)";
            case 'bottom':
                return "translateY(-" + this.height + "px)";
            default:
                return "";
        }
    }

    killTranslation(i){
        this.video[i].addClass('notransition');
        this.video[i].css({transition: 'none', transform: '',});
        let res = this.video[i].get(0).offsetHeight;
        this.video[i].removeClass('notransition');
        if(i===this.flag)
            this.video[i].css({top:0, left:0, opacity: 1.0, transition: '', transform: ''});
        else
            this.setNextCss();
        return res;
    }

    setNextCss(){
        let { mode, flag, video} = this;
        let {top, left} = this.wrapper.offset();
        switch(mode){
            case 'right':
                video[1-flag].offset({
                    top: top,
                    left: left + this.width
                });
                break;
            case 'left':
                video[1-flag].offset({
                    top: top,
                    left: left-this.width
                });
                break;
            case 'top':
                video[1-flag].offset({
                    top: top-this.height,
                    left: left
                });
                break;
            case 'bottom':
                video[1-flag].offset({
                    top: top+this.height,
                    left: left
                });
                break;
            default:
                video[1-flag].css({
                    top: 0,
                    left: 0,
                    opacity: 0.0
                });
        }
    }

    build(){
        let viewport = '<div class="video-viewport" ></div>';
        let video = [
            '<video class="slide0 snackvideo" preload="auto" ></video>',
            '<video class="slide1 snackvideo" preload="auto" ></video>',
        ];
        this.wrapper.append(viewport);
        this.viewport = this.wrapper.children('.video-viewport');
        this.viewport.css({
            width: this.width,
            height: this.height,
        });
        this.viewport.append(video);
        this.video = [ this.viewport.children('.slide0'), this.viewport.children('.slide1') ];
        for(let i=0; i<2; i++){
            this.video[i].css({
                top: 0,
                left: 0,
                width: this.width,
                height: this.height,
                objectFit: this.fit,
                transition: '',
                transform: '',
                zIndex: 10-i,
            });
            this.video[i].attr("poster", this.poster);
            this.video[i].get(0).muted = this.muted;
            this.video[i].attr("src", this.current);
            this.video[i].get(0).load();
        }
        this.setNextCss();
    }

    play(){
        if((!this.ended()) && this.paused()) return this.video[this.flag].get(0).play();

        let obj = this;
        let { length, video, flag, speed } = obj;

        function fn(){
            obj.video[flag].css({top:0, left:0, opacity: 1.0, transition: '', transform: ''});
            obj.video[flag].get(0).play();
            obj.video[1-flag].attr("src", obj.current);
            obj.video[1-flag].get(0).load();
            obj.setNextCss();
        }

        if(length === 0) return;
        video[flag].css('z-index', 9);
        flag = 1 - flag;
        this.flag = flag;
        if(this.mode === 'fade'){
            video[flag].css('z-index', 10)
                .animate({top:0, left:0, opacity: 1.0}, speed, fn);
        }else{
            video[flag].css({
                zIndex : 10,
                transition: "transform " + this.speed/1000 + "s ease",
                transform: this.transformValue,
            }).one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', fn);
        }
    }

    start(){
        if(this.length === 0) return;
        this.worker = true;
        this.video[this.flag].get(0).play();
        this.video[this.flag].on('ended', this.play);
        this.video[1-this.flag].on('ended', this.play);
    }

    destroy(){
        this.worker = false;
        this.video[0].off('ended');
        this.video[1].off('ended');
        this.killTranslation(0);
        this.killTranslation(1);
    }

    stop(){
        this.destroy();
        this.video[this.flag].get(0).pause();
        this.video[1-this.flag].get(0).pause();
    }
}
