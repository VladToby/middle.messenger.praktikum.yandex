import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Block from './Block';

describe('Block', () => {
    let TestBlock: typeof Block;

    beforeEach(() => {
        TestBlock = class extends Block {
            render() {
                return '<div>Test</div>';
            }
        };
    });

    it('should create an instance with unique id', () => {
        const block = new TestBlock({});
        expect(block.id).to.be.a('string').and.not.empty;
    });

    it('should call init method on creation', () => {
        const initSpy = sinon.spy(TestBlock.prototype, 'init');
        new TestBlock({});
        expect(initSpy.calledOnce).to.be.true;
    });

    it('should set props correctly', () => {
        const block = new TestBlock({ prop: 'value' });
        expect(block.props.prop).to.equal('value');
    });

    it('should update props and emit FLOW_CDU event', () => {
        const block = new TestBlock({ prop: 'value' });
        const eventBusSpy = sinon.spy(block.eventBus(), 'emit');
        block.setProps({ prop: 'newValue' });
        expect(eventBusSpy.calledWith(Block.EVENTS.FLOW_CDU)).to.be.true;
    });

    it('should render content', () => {
        const block = new TestBlock({});
        const content = block.getContent();
        expect(content.innerHTML).to.include('Test');
    });

    it('should add event listeners', () => {
        const callback = sinon.spy();
        const block = new TestBlock({ events: { click: callback } });
        block.getContent().click();
        expect(callback.calledOnce).to.be.true;
    });

    it('should call componentDidMount after mounting', () => {
        const componentDidMountSpy = sinon.spy(TestBlock.prototype, 'componentDidMount');
        const block = new TestBlock({});
        block.dispatchComponentDidMount();
        expect(componentDidMountSpy.calledOnce).to.be.true;
    });

    it('should hide content', () => {
        const block = new TestBlock({});
        block.hide();
        expect(block.getContent().style.display).to.equal('none');
    });

    it('should show content', () => {
        const block = new TestBlock({});
        block.hide();
        block.show();
        expect(block.getContent().style.display).to.equal('');
    });
});
