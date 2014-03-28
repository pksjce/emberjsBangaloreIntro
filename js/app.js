App = Ember.Application.create();

App.Router.map(function() {
	this.resource('threads');
	this.resource('thread', {path:'/thread/:thread_id'});
});

App.IndexRoute = Ember.Route.extend({  
  redirect:function(){
  	this.transitionTo('threads');
  }
});

App.ThreadsRoute = Ember.Route.extend({
	model: function() {
	    return threads;
	},
});

App.ThreadsController = Ember.Controller.extend({	
	isEditing:false,
	actions:{
		'done':function(){
			this.set('isEditing', false);			
			var newThread = this.get('newItem')
			if(newThread.text){
				this.get('model').pushObject(newThread);
			}
		},
		'addThread':function(){
			this.set('isEditing', true);
			var threads = this.get('model');
			var newThread = {
				id:threads.length + 1,
				text:"",
				posts:[],
				markdown:''
			};
			this.set('newItem', newThread);
		}
	},
	setText:function(){		
		this.set('newItem.text', this.get('newItem.markdown'));
	}.observes('newItem.markdown')
});



App.ThreadRoute = Ember.Route.extend({
  model: function(params) {
    return threads.findBy('id', parseInt(params.thread_id));
  }
});

App.ThreadController = Ember.Controller.extend({
	isEditing:false,
	postLength:function(){
		return !!this.get('model.posts').length;
	}.property(),
	actions:{
		'done':function(){
			this.set('isEditing', false);			
			var newPost = this.get('newItem')
			if(newPost.text){
				this.get('model.posts').pushObject(newPost);
			}
		},
		'addPost':function(){
			this.set('isEditing', true);
			var posts = this.get('model.posts');
			var newPost = {
				id:posts.length + 1,
				text:"",
				markdown:""
			};
			this.set('newItem', newPost);
		}
	},
	last_active:function(){
		var last_active = moment('01011987','DDMMYYYY');
		this.get('model.posts').forEach(function(post){
			if(post.date_created > last_active){
				last_active = post.date_created;
			}
		})
		this.set('model.last_active', last_active);
	}.property('posts.@each.date_created'),
	setText:function(){		
		this.set('newItem.text', this.get('newItem.markdown'));
	}.observes('newItem.markdown')
});


var threads = [{
		id:1,
		text:"How to start learning Ember",
		posts:[{
			id:1,
			text:"Got see the website!",
			date_created:moment()
		},{
			id:2,
			text:"There's a meetup tonight.",
			date_created:moment(),
		}]
	},{
		id:2,
		text:"What is two way binding?",
		posts:[{
			id:1,
			text:"It is awesome!",
			date_created:moment()
		}]
	},{
		id:3,
		text:"Ember is great!",
		posts:[]
	}
];

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});



