# SnackSliderV
SnackSliderV is a simple video slide show library that focuses on allowing to change options and images while running.
The source length of the SnackSliderV is less than 400 lines, and it has a very simple structure.

## Feature

- No control button, only functions. (You can easily create buttons by invoking a function.)
- Super smooth slide change.
- You can add and delete video while running a slide show smoothly.
- You can modify all options while running a slide show : mode, speed, etc...

## Dependency

- JQuery (3.1 or above)

## Tested browser

- Chrome 73
- Safari 12

## Remark

As you know, video auto-run is blocked by default on Chrome.
Adjust to run in mute mode on chrome.
If you only want to run on a particular browser, you can change the settings in the following ways:

1. Enter this into the address bar:
    ````
    chrome://flags/#autoplay-policy

    ````
2. Select 'No user gesture is required'
    

## Usage

Please refer to the test folder.


````
<script>
        let slider;
        $(document).ready(function () {
            slider = new SnackSlider({
                selector: '.slider',
                mode: 'right',
                speed: 2000,
                pause: 3000,
                width: 320,
                height: 240,
                fit: 'cover',
                children: [
                    './rainbow.jpg',
                    './rio.jpg',
                    './spiral-staircase.jpg',
                ]
            });
        });
    </script>


</head>
<body>
    <div class="slider" style="width:640px;height:480px"></div>

````

## Options

| Option Name | Type | Default value | Description |
| ----------- | ---- | ------------- | ----------------------------------------------------------------------|
| selector    | string | -           | Required. JQuery selector pointing to the html element to include the slider. |
| mode        | string | 'right'     | One of 'right', 'left', 'top', 'bottom', 'fade'. Mode of slide show. |
| speed       | integer| 1000        | The amount of time it takes for an animation to change images. (ms) |
| poster      | string | ''          | Specifies an image to be shown until to start playing |
| width       | integer| 0           | If 0, width is parent element's width. |
| height      | integer| 0           | If 0, height is parent element's height. |
| fit         | string | 'cover'     | Value of css 'object-fit' for slide's img tag |
| muted       | boolean| false       | Specifies that the audio output of the video should be muted |


## Changelog

**V1.0.1**
- Remove some bug. 

**V1.0.0**
- First commit.

## License

**MIT**

## Remarks

If you find that SnackSliderV is useful, please support me with [a glass of beer :beer:](https://www.paypal.me/SeunghoYi). 

