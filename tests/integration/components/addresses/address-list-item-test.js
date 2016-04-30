import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('addresses/address-list-item', 'Integration | Component | addresses/address list item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{addresses/address-list-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#addresses/address-list-item}}
      template block text
    {{/addresses/address-list-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
