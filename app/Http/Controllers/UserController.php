<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GrahamCampbell\GitHub\GitHubManager;
use App\Article;
use App\User;
use App\Enjoy;
use App\Follower;
use Storage;
use Auth;

class UserController extends Controller {
	/**
	 * Profile
	 * This is how you can see your profile
	 * @return void
	 */
	public function profile($username) {
		$users = User::where('username', '=', $username)->count();
		if($users > 0) {
			$user = User::where('username', '=', $username)->firstOrFail();
			$articles = Article::where('user_id', $user->id)->where('published', '=', '1')->get();
			return view('user/profile', ['user' => $user, 'articles' => $articles]);
		}else{
			return redirect('/');
		}
	}
}
