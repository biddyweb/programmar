<?php
//Refactored roots

//OAuth
Route::get('oauth/{account}', 'OAuthController@access');
Route::get('logout', 'OAuthController@logout');
Route::get('auth/{account}', 'OAuthController@create');

//About
Route::get('about', 'StaticController@about');
Route::get('team', 'StaticController@team');
Route::get('terms', 'StaticController@terms');

//Main Routes
Route::get('/', 'HomeController@all');
Route::get('dev/{username}', 'UserController@profile');
Route::get('write', 'ArticleController@write');
Route::get('edit/{slug}', 'ArticleController@edit')->where('slug', '[0-9]+');
Route::get('article/{slug}', 'ArticleController@view')->where('slug', '[0-9]+');
Route::get('popular/{page?}', 'HomeController@popular')->where('page', '[0-9]+');
Route::get('all/{page?}', 'HomeController@all')->where('page', '[0-9]+');
Route::get('drafts/{page?}', 'UserController@drafts')->where('page', '[0-9]+');
Route::get('following/{page?}', 'UserController@following')->where('page', '[0-9]+');

//Api
Route::get('api/v2/followers/{user_id?}', 'ApiController@followers');
Route::get('api/v2/following/{user_id?}', 'ApiController@following');
Route::post('api/v2/follow/{user_id}', 'ApiController@follow');
Route::post('api/v2/unfollow/{user_id}', 'ApiController@unfollow');
Route::get('api/v2/user/{user_id?}', 'ApiController@user');
Route::get('api/v2/article/{article_id}', 'ApiController@collect');
Route::get('api/v2/feed/{view}/{page?}', 'ApiController@feed');
Route::get('api/v2/articles/{user_id?}', 'ApiController@articles');
Route::get('api/v2/content/{article_id}', 'ApiController@content');
Route::get('api/v2/enjoys/{user_id?}', 'ApiController@enjoys');


//Api Routing
Route::post('/api/internal/v1/editor/save', 'EditorController@save');
Route::post('/api/internal/v1/editor/publish', 'EditorController@publish');
Route::post('/api/internal/v1/editor/delete', 'EditorController@delete');

Route::post('/api/internal/v1/article/enjoy', 'ArticleController@enjoy');