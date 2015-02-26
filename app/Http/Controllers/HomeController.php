<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Article;
use App\User;
use App\Enjoy;
use App\Follower;
use Storage;
use Auth;

class HomeController extends Controller {

	//Show all recent Articles
	public function all($page = 1)
	{
		return view('home/all');
	}

}
