import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion } from 'navigation-react-mobile';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
window.addEventListener = () => {};
global.window = window;
global.document = window.document;
var now = window.performance.now()
window.performance.now = () => now+=500;
window.requestAnimationFrame = callback => {
    callback(window.performance.now())
};
window.cancelAnimationFrame = () => {};

describe('NavigationMotion', function () {
    describe('A', function () {
        it('should render A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B', function () {
        it('should render _ -> B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B', function () {
        it('should render A -> B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to A', function () {
        it('should render A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigateBack(1);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B to A', function () {
        it('should render A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            stateNavigator.navigateBack(1);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A', function () {
        it('should render A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneA');
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to B', function () {
        it('should render B+', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0+");
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneA"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to B to C', function () {
        it('should render C++', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            stateNavigator.navigate('sceneC');
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0++");
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> B', function () {
        it('should render _ -> B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            var url = stateNavigator.fluent()
                .navigate('sceneC')
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> B to C', function () {
        it('should render C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            var url = stateNavigator.fluent()
                .navigate('sceneC')
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            stateNavigator.navigateBack(1)
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B to C -> B', function () {
        it('should render A -> B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            var url = stateNavigator.fluent()
                .navigate('sceneC')
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B to C -> B to C', function () {
        it('should render C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            var url = stateNavigator.fluent()
                .navigate('sceneC')
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            stateNavigator.navigateBack(1);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B to C -> D', function () {
        it('should render A -> D+', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            var SceneD = () => <div id="sceneD" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            sceneD.renderScene = () => <SceneD />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            var url = stateNavigator.fluent()
                .navigate('sceneC')
                .navigate('sceneD').url;
            stateNavigator.navigateLink(url);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1+");
                assert.notEqual(scenes[1].querySelector("#sceneD"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B -> C', function () {
        it('should render A -> _ -> C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            var url = stateNavigator.fluent(true)
                .navigate('sceneB')
                .navigate('sceneC').url;
            stateNavigator.navigateLink(url);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 3);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.equal(scenes[2].id, "2");
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B -> C to A -> B', function () {
        it('should render A -> B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            var url = stateNavigator.fluent(true)
                .navigate('sceneB')
                .navigate('sceneC').url;
            stateNavigator.navigateLink(url);
            stateNavigator.navigateBack(1);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B -> C to A -> D -> C', function () {
        it('should render A -> _ -> C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            var SceneD = () => <div id="sceneD" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            sceneD.renderScene = () => <SceneD />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            var url = stateNavigator.fluent(true)
                .navigate('sceneB')
                .navigate('sceneC').url;
            stateNavigator.navigateLink(url);
            url = stateNavigator.fluent(true)
                .navigateBack(2)
                .navigate('sceneD')
                .navigate('sceneC').url;
            stateNavigator.navigateLink(url);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 3);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.equal(scenes[2].id, "2");
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneD"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B -> C to A -> D -> C to A -> D', function () {
        it('should render A -> D', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            var SceneD = () => <div id="sceneD" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            sceneD.renderScene = () => <SceneD />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            var url = stateNavigator.fluent(true)
                .navigate('sceneB')
                .navigate('sceneC').url;
            stateNavigator.navigateLink(url);
            url = stateNavigator.fluent(true)
                .navigateBack(2)
                .navigate('sceneD')
                .navigate('sceneC').url;
            stateNavigator.navigateLink(url);
            stateNavigator.navigateBack(1);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneD"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B -> C to A', function () {
        it('should render A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            var url = stateNavigator.fluent(true)
                .navigate('sceneB')
                .navigate('sceneC').url;
            stateNavigator.navigateLink(url);
            stateNavigator.navigateBack(2);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B -> C to A', function () {
        it('should render A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            stateNavigator.navigate('sceneC');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigateBack(2);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B -> C to B', function () {
        it('should render B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            stateNavigator.navigate('sceneC');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            var url = stateNavigator.fluent()
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> A', function () {
        it('should render A -> A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneA');
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneA"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> A to A -> B', function () {
        it('should render A -> B+', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneA');
            var url = stateNavigator.fluent(true)
                .navigateBack(1)
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1+");
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> A to A -> B to A -> B -> C to A -> B to A -> C', function () {
        it('should render A -> C++', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneA');
            var url = stateNavigator.fluent(true)
                .navigateBack(1)
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            stateNavigator.navigate('sceneC');
            stateNavigator.navigateBack(1);
            url = stateNavigator.fluent(true)
                .navigateBack(1)
                .navigate('sceneC').url;
            stateNavigator.navigateLink(url);
            try {
                var scenes = container.querySelectorAll(".scene");                
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1++");
                assert.notEqual(scenes[1].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Set state', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var update;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => {
                var [updated, setUpdated] = useState(false)
                update = setUpdated;
                return <div id='sceneB' data-updated={updated} />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            update(true);
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneB");                
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Crumb set state', function () {
        it('should not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var update;
            var SceneA = () => {
                var [updated, setUpdated] = useState(false)
                update = setUpdated;
                return <div id='sceneA' data-updated={updated} />;
            };
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            update(true);
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");                
                assert.strictEqual(scene.dataset.updated, 'false');
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Crumb set state navigate back', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var update;
            var SceneA = () => {
                var [updated, setUpdated] = useState(false)
                update = setUpdated;
                return <div id='sceneA' data-updated={updated} />;
            };
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div id={key} key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            update(true);
            stateNavigator.navigateBack(1);
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");                
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Re-render NavigationStack', function () {
        it('should only re-render current scene', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = ({updated}) => <div id='sceneA' data-updated={updated} />;
            var SceneB = ({updated}) => <div id='sceneB' data-updated={updated} />;
            sceneA.renderScene = (updated) => <SceneA updated={updated} />;
            sceneB.renderScene = (updated) => <SceneB updated={updated} />;
            var container = document.createElement('div');
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion renderScene={(state) => state.renderScene(updated)}>
                            {(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}
                        </NavigationMotion>
                    </NavigationHandler>
                );
            }
            ReactDOM.render(<App />, container);
            stateNavigator.navigate('sceneB');
            update(true);
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");
                assert.strictEqual(scene.dataset.updated, 'false');
                scene = container.querySelector<HTMLDivElement>("#sceneB");
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
