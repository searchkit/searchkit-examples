const react = require('react');
import raf from "./test-helpers/rAFPolyfill"
import {configure} from "enzyme"
import EnzymeAdapterReact16 from "enzyme-adapter-react-16"
global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
};

configure({ adapter: new EnzymeAdapterReact16()})


module.exports = react;