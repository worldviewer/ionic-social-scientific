angular.module('starter')

// Required for authentication and authorization: If our http
// interceptor sees that some request is invalid, he will 
// broadcast one of these two AUTH_EVENTS, and our AppCtrl
// controller which holds our complete app will recognize this
// and handle the event.
.constant('AUTH_EVENTS', {
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
	admin: 'admin_role',
	public: 'public_role'
});