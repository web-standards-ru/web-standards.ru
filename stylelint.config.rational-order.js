const special = {
    properties: ['all']
};

const positioning = {
    properties: [
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index'
    ]
};

const boxmodel = {
    properties: [
        'display',
        'flex',
        'flex-grow',
        'flex-shrink',
        'flex-basis',
        'flex-flow',
        'flex-direction',
        'flex-wrap',
        'justify-content',
        'align-content',
        'align-items',
        'align-self',
        'order',
        'float',
        'clear',
        'box-sizing',
        'width',
        'min-width',
        'max-width',
        'height',
        'min-height',
        'max-height',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'overflow',
        'overflow-x',
        'overflow-y'
    ]
};

const typography = {
    properties: [
        'color',
        'font',
        'font-weight',
        'font-size',
        'font-family',
        'font-style',
        'font-display',
        'font-variant',
        'font-size-adjust',
        'font-stretch',
        'font-effect',
        'font-emphasize',
        'font-emphasize-position',
        'font-emphasize-style',
        'font-smooth',
        'line-height',
        'direction',
        'letter-spacing',
        'white-space',
        'text-align',
        'text-align-last',
        'text-transform',
        'text-decoration',
        'text-emphasis',
        'text-emphasis-color',
        'text-emphasis-style',
        'text-emphasis-position',
        'text-indent',
        'text-justify',
        'text-outline',
        'text-wrap',
        'text-overflow',
        'text-overflow-ellipsis',
        'text-overflow-mode',
        'text-orientation',
        'text-shadow',
        'vertical-align',
        'word-wrap',
        'word-break',
        'word-spacing',
        'overflow-wrap',
        'tab-size',
        'hyphens',
        'unicode-bidi',
        'columns',
        'column-count',
        'column-fill',
        'column-gap',
        'column-rule',
        'column-rule-color',
        'column-rule-style',
        'column-rule-width',
        'column-span',
        'column-width',
        'page-break-after',
        'page-break-before',
        'page-break-inside',
        'src'
    ]
};

const visual = {
    properties: [
        'list-style',
        'list-style-position',
        'list-style-type',
        'list-style-image',
        'table-layout',
        'empty-cells',
        'caption-side',
        'background',
        'background-color',
        'background-image',
        'background-repeat',
        'background-position',
        'background-position-x',
        'background-position-y',
        'background-size',
        'background-clip',
        'background-origin',
        'background-attachment',
        'background-blend-mode',
        'box-decoration-break',
        'border',
        'border-width',
        'border-style',
        'border-color',
        'border-top',
        'border-top-width',
        'border-top-style',
        'border-top-color',
        'border-right',
        'border-right-width',
        'border-right-style',
        'border-right-color',
        'border-bottom',
        'border-bottom-width',
        'border-bottom-style',
        'border-bottom-color',
        'border-left',
        'border-left-width',
        'border-left-style',
        'border-left-color',
        'border-radius',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius',
        'border-image',
        'border-image-source',
        'border-image-slice',
        'border-image-width',
        'border-image-outset',
        'border-image-repeat',
        'border-collapse',
        'border-spacing',
        'outline',
        'outline-width',
        'outline-style',
        'outline-color',
        'outline-offset',
        'box-shadow',
        'transform',
        'transform-origin',
        'transform-style',
        'backface-visibility',
        'perspective',
        'perspective-origin',
        'visibility',
        'cursor',
        'opacity',
        'filter',
        'backdrop-filter'
    ]
};

const animation = {
    properties: [
        'transition',
        'transition-delay',
        'transition-timing-function',
        'transition-duration',
        'transition-property',
        'animation',
        'animation-name',
        'animation-duration',
        'animation-play-state',
        'animation-timing-function',
        'animation-delay',
        'animation-iteration-count',
        'animation-direction',
        'animation-fill-mode'
    ]
};

const misc = {
    properties: [
        'appearance',
        'clip',
        'clip-path',
        'counter-reset',
        'counter-increment',
        'resize',
        'user-select',
        'nav-index',
        'nav-up',
        'nav-right',
        'nav-down',
        'nav-left',
        'pointer-events',
        'quotes',
        'touch-action',
        'will-change',
        'zoom',
        'fill',
        'fill-rule',
        'clip-rule',
        'stroke'
    ]
};

const propertiesOrder = [
    special,
    positioning,
    boxmodel,
    typography,
    visual,
    animation,
    misc
];

const ruleOrder = [
    'custom-properties',
    'declarations'
];

module.exports = {
    rules: {
        'order/order': ruleOrder,
        'order/properties-order': propertiesOrder
    }
};
