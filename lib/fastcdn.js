'use babel';

import FastcdnView from './fastcdn-view';
import {
    CompositeDisposable
} from 'atom';

export default {

    fastcdnView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.fastcdnView = new FastcdnView(state.myPackageViewState);
        this.modalPanel = this.fastcdnView.panel
            // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'fastcdn:add': () => this.toggle()
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.myPackageView.destroy();
    },

    serialize() {
        return {
            myPackageViewState: this.fastcdnView.serialize()
        };
    },

    toggle() {
        console.log('MyPackage was toggled!');
        if (this.modalPanel.isVisible()) {
            this.modalPanel.hide()
        } else {
            this.modalPanel.show()
            this.fastcdnView.focusFilterEditor()
        }
    }

};
