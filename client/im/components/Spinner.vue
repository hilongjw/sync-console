<style>
@keyframes umspin {
    0% {
        transform: rotate(0)
    }
    50% {
        transform: rotate(180deg)
    }
    100% {
        transform: rotate(360deg)
    }
}
.uim-spinner {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -15px;
    margin-left: -15px;
}
.uim-spinner-icon {
    width: 30px;
    height: 30px;
    animation: umspin .6s linear infinite;
}
.uim-spinner.inline {
    display: inline-block;
    position: relative;
}
</style>

<template>
    <div class="uim-spinner">
        <img class="uim-spinner-icon" src="/static/images/spinner.png" alt="">
    </div>
</template>