<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * 
 *
 * @package		Video Audio
 * @version		Version 1.0.0
 * @author		RL
 * @copyright	Copyright (c) 2012
 *
 */

class Video_audio_helper {

	var $version = "1.0.0";

	/**
	 * Constructor
	 */
	function __construct()
	{
		$this->EE =& get_instance();


		// prepare cache for head files

		if (! isset($this->EE->session->cache['video_audio']['head_files']))
		{
			$this->EE->session->cache['video_audio']['head_files'] = false;
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Insert JS code
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 */
	function insert_js($str)
	{
		$this->EE->cp->add_to_head('<script type="text/javascript">' . $str . '</script>');
	}

	// --------------------------------------------------------------------

	/**
	 * Insert JS file
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 */
	function insert_js_file($file)
	{
		$this->EE->cp->add_to_head('<script charset="utf-8" type="text/javascript" src="'.$this->_theme_url().'scripts/'.$file.'?'.$this->version.'"></script>');
	}

	// --------------------------------------------------------------------

	/**
	 * Insert CSS file
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 */
	function insert_css_file($file)
	{
		$this->EE->cp->add_to_head('<link rel="stylesheet" type="text/css" href="'.$this->_theme_url().'styles/'.$file.'?'.$this->version.'" />');
	}

	// --------------------------------------------------------------------

	/**
	 * Load heading files once (load_head_files)
	 *
	 * @access	private
	 * @return	void
	 */
	function include_resources()
	{

		if (!$this->EE->session->cache['video_audio']['head_files'])
		{

			$this->insert_css_file('video_audio.css');

			$this->insert_js_file('video_audio.js');

			$this->EE->session->cache['video_audio']['head_files'] = true;
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Theme URL
	 *
	 * @access	private
	 * @return	string
	 */
	function _theme_url()
	{
		$url = PATH_THIRD_THEMES."video_audio/";
		return $url;
	}
}

// END Video_audio_helper class

/* End of file helper.php */
/* Location: ./system/expressionengine/third_party/video_audio/helper.php */