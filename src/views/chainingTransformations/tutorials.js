window.SceneSimpleExampleRender = function (learn, vshaders_dictionary,
    fshaders_dictionary, models, controls) {

    // Private variables
    var self = this; // Store a local reference to the new object.

    var out = learn.out;
    var events;
    var canvas;

    var gl = null;
    var program = null;
    var render_models = {};

    var matrix = new Learn_webgl_matrix();
    var transform = matrix.create();
    var projection = matrix.createOrthographic(-8, 8, -8, 8, -8, 8);
    var view = matrix.create();
    var base_y_rotate = matrix.create();

    // We don't have a real view transform at this time, but we want to look
    // down on the model, so we will rotate everything by 10 degrees.
    matrix.rotate(view, 10, 1, 0, 0);

    // Public variables that will be changed by event handlers or that
    // the event handlers need access to.
    self.canvas_id = learn.canvas_id;
    self.base_y_angle = 0.0;
    self.animate_active = true;

    //-----------------------------------------------------------------------
    // Public function to render the scene.
    self.render = function () {

        // Clear the entire canvas window background with the clear color and
        // the depth buffer to perform hidden surface removal.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // The base is being rotated by the animation callback so the rotation
        // about the y axis must be calculated on every frame.
        matrix.rotate(base_y_rotate, self.base_y_angle, 0, 1, 0);

        // Combine the transforms into a single transformation
        matrix.multiplySeries(transform, projection, view, base_y_rotate);

        // Draw the models
        render_models.base.render(transform);
    };

    //-----------------------------------------------------------------------
    // Public function to delete and reclaim all rendering objects.
    self.delete = function () {
        // Clean up shader programs
        gl.deleteShader(program.vShader);
        gl.deleteShader(program.fShader);
        gl.deleteProgram(program);
        program = null;

        // Delete each model's buffer objects
        render_models.base.delete();
        render_models = null;

        // Disable any animation
        self.animate_active = false;

        // Remove all event handlers
        events.removeAllEventHandlers();
        events = null;

        // Release the GL graphics context
        gl = null;
    };

    //-----------------------------------------------------------------------
    // Object constructor. One-time initialization of the scene.

    // Get the rendering context for the canvas
    canvas = learn.getCanvas(self.canvas_id);
    if (canvas) {
        gl = learn.getWebglContext(canvas);
        if (!gl) {
            return;
        }
    }

    // Enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    // Set up the rendering shader program and make it the active shader program
    program = learn.createProgram(gl, vshaders_dictionary.shader05, fshaders_dictionary.shader05);
    gl.useProgram(program);

    // Create the Buffer Objects needed for this model and copy
    // the model data to the GPU.
    render_models.base = new Learn_webgl_model_render_05(gl, program, models.Base, out);

    // Set up callbacks for the user and timer events
    events = new SimpleTransformExampleEvents(self, controls);
    events.animate();
};