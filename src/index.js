
(function(){
    let time = Date.now();
    let simulation = new Simulation();
    function frame(timestamp){
        let dt = timestamp - time;
        dt = clamp(dt, 5, 30);
        simulation.update(dt / 1000);
        simulation.render();
        frameId = window.requestAnimationFrame(frame);
    }
    let frameId = window.requestAnimationFrame(frame);
})();