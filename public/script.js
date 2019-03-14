console.log("It works!");
var LOAD_NUM = 4;
var watcher;

//setTimeout(function() {
new Vue({
	el: '#app',
	data: {
		total: 0,
		products: [],
		cart: [],
		search: 'dog',
		lastSearch: '',
		loading: false,
		results: []
	},
	methods: {
		addToCart: function(product) {
			//console.log(product.id);
			this.total += product.price;
			var found = false;
			for (var i = 0, ii = this.cart.length; i < ii; i++) {
				if (this.cart[i].id === product.id) {
					this.cart[i].qty++;
					found = true;
					break;
				}
			}
			if (!found) {
				this.cart.push({
					id: product.id,
					title: product.title,
					price: product.price,
					qty: 1
				});
			}
		},
		inc: function(item) {
			console.log("inc");
			item.qty++;
			this.total += item.price;
		},
		dec: function(item) {
			console.log("dec");
			if (item.qty <= 0) {
				var i = this.cart.indexOf(item);
				this.cart.splice(i, 1);
			}
			item.qty--;
			this.total -= item.price;
		},
		onSubmit: function() {
			console.log('Search');
			this.products = [];
			this.results = [];
			this.loading = true;
			var path = '/search?q='.concat(this.search);
			this.$http.get(path).then(function(response) {
				//console.log(response);
				//setTimeout(function() {
					this.results = response.body;
					this.lastSearch = this.search;
					this.appendResults();
					this.loading = false;
				//}.bind(this), 3000);
			})
		},
		appendResults: function() {
			//console.log('Append results');
			if (this.products.length < this.results.length) {
				var toAppend = this.results.slice(
					this.products.length,
					LOAD_NUM + this.products.length
				);
				this.products = this.products.concat(toAppend);
			}
		}
	},
	filters: {
		currency: function(price) {
			return "$".concat(price.toFixed(2));
		}
	},
	created: function() {
		this.onSubmit();
	},
	beforeUpdate: function() {
		if (watcher) {
			watcher.destroy();
			watcher = null;
		}
	},
	updated: function() {
		var sensor = document.querySelector('#product-list-bottom');
		watcher = scrollMonitor.create(sensor);
		watcher.enterViewport(this.appendResults);
	}
});

//}, 3000);
