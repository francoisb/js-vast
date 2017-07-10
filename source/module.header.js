"use strict";
(function(name, dependencies, context, definition) {

    // CommonJS and AMD suport
    if (typeof context['module'] === 'object') {
        // CommonJS
        if (dependencies && context['require']) {
            for (var i = 0; i < dependencies.length; i++) {
                context[dependencies[i]] = context['require'](dependencies[i]);
            }
        }
        context['module']['exports'] = definition.apply(context);
    } else if (typeof context['define'] === 'function' && context['define']['amd']) {
        // AMD
        define(name, (dependencies || []), definition);
    } else {
        // Global Variables
        if (dependencies && context['require']) {
            for (var i = 0; i < dependencies.length; i++) {
                dependencies[i] = context[dependencies[i]];
            }
        }
        context[name] = definition.call(context, dependencies);
    }

})('js-vast', [], (this || {}), function() {

    var module = {
        compatibility: {},
        models:  {},
        players: {
            companion: {},
            mediafile: {}
        },
        xml:     {}
    };

