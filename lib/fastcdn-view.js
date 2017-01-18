'use babel';
var rp = require('request-promise');
import {
    SelectListView
} from 'atom-space-pen-views'

export default class FastcdnView extends SelectListView {
  constructor(state) {
    super()
    this.search = '';
    this.version = '';

    this.panel = atom.workspace.addModalPanel({
      item: state || this,
      visible: false
    })
    this.find('input').on('keyup', function(e){
      console.log('e.keyCode:', e.keyCode)
      if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) return
      if(!this.search){
        rp(`https://api.cdnjs.com/libraries?search=${this.find('span').html()}`)
        .then(function(htmlString) {
          if(this.search) return
          var data = JSON.parse(htmlString)
          this.setItems(data.results.map(function(item) {
            return item.name
          }))
        }.bind(this))
        .catch(function() {

        })
      }
    }.bind(this))
  }
  serialize() {}

  viewForItem(item) {
    return `<li>${item}</li>`
  }
  confirmed(item) {
    console.log(`${item} was selected`)
    if(!this.search){
      this.search = item
      this.setItems([])
      this.setLoading('loading cdnfiles...')
      rp(`https://api.cdnjs.com/libraries/${item}`)
      .then(function(htmlString) {
        var data = JSON.parse(htmlString)
        this.version = data.version
        this.setItems(data.assets[0].files)
      }.bind(this))
      .catch(function() {
      })
    } else {
      atom.workspace.getActivePaneItem().insertText(`https://cdn.staticfile.org/${this.search}/${this.version}/${item}`, {
        select: true
      })
      // atom.workspace.getActivePaneItem().insertText(`https://cdnjs.cloudflare.com/ajax/libs/${this.search}/${this.version}/${item}`)
      this.search = ''
      this.version = ''
      this.setLoading('input file name to search...')
      this.setItems([])
      this.panel.hide()
      atom.workspace.getActivePane().activate()
    }
    // this.panel.hide()
  }
  destroy(){
    this.panel.hide()
  }
  cancelle() {
    console.log(`This view was cancelled`)
  }
}
