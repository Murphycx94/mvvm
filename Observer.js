/**
 * observer
 */


const observer = (data) => {
	if (!data || typeof data !== 'object') return
	Object.keys(data).forEach(function(key) {
		defineReactive(data, key, data[key])
	})
}

const defineReactive = (data, key, value) => {
	const dep = new Dep()
	observer(value)
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: false,
		get: function() {
			Dep.target && dep.addDep(Dep.target)
			return value
		},
		set: function(newValue) {
			value = newValue
			dep.notify()
			console.log('newValue: ' + value)
		}
	})
}
/*--------------------- 订阅器 ------------------*/
function Dep() {
	this.subs = []
}
Dep.prototype = {
	addSub: function(sub) {
		this.subs.push(sub)
	},
	notify: function() {
		this.subs.forEach(function(sub) {
			sub.update()
		})
	}
};

function Watcher(vm, key, cb) {
	this.cb = cb
	this.vm = vm
	this.key = key
	this.value = this.get()
}

Watcher.prototype = {
	get() {
		Dep.target = this
		const value = data[key] // 触发observer的getter
		Dep.target = null
		return value
	},
	update() {
		this.run()
	},
	run() {
		const value = this.get()
		const oldValue = this.value
		if (value !== oldValue) {
			this.value = oldValue
			this.cb.call(this.vm, value, oldValue)
		}
	}
}

function Compile(el) {
	this.$el = el
	if (this.$el) {
		this.$fragment = this.nodeToFragment(this.$el)
		this.init()
		this.$el.appendChild(this.$fragment)
	}
}

Compile.prototype = {
	init() {
		this.compileElement(this.$fragment)
	},
	nodeToFragment(el) {
		const fragment = document.createDocumentFragment()
		let child = null
		while (child = el.firstChild) {
			fragment.appendChild(child)
		}
		return fragment
	},
	compileElement(node) {
		if (node && node.nodeType === 1) {
			console.log(node.tagName)
		}
		var text = node.textContent;
		const reg = /\{\{(.*)\}\}/;
		const len = node.childElementCount
		let	child = node.firstElementChild
		for (let i = 0; i < len; i++) {
			this.compileElement(child)
			// child = child.nextElementSibling
		}
	}
}




// const data = {
// 	value: 'hello'
// }
// observer(data)
//
// setTimeout(() => {
// 	data.value = 'world' // output: value: hello    newValue: world
// }, 2000)
