<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Video_audio_ft extends EE_Fieldtype {

    var $info = array(
        'name'      => 'Video Audio',
        'version'   => '1.0'
    );

	//Needed in order to get the fieldtype to work as a single AND tag pair
	var $has_array_data = TRUE;

	/**
     * Constructor
     *
     * @access	public
     */
    function __construct()
	{
		parent::EE_Fieldtype();		
		
		// load video player package
        
		$this->EE->load->add_package_path(PATH_THIRD . 'video_audio/');
        
        
		// load language file
        
		$this->EE->lang->loadfile('video_audio');
        
        
		// load helper
        
		if (! class_exists('Video_audio_helper'))
		{
			require_once PATH_THIRD.'video_audio/helper.php';
		}
        
		$this->helper = new Video_audio_helper;
        
        
		// prepare cache for head files
        
		if (! isset($this->EE->session->cache['video_audio']['head_files']))
		{
			$this->EE->session->cache['video_audio']['head_files'] = false;
		}
		
	}

    // --------------------------------------------------------------------

    /**
	 * Display Field on Publish
	 *
	 * @access	public
	 * @param	existing data
	 * @return	field html
	 *
	 */
	function display_field($data)
	{
		return $this->get_field_markup($data, FALSE);
	}
	
	
	// --------------------------------------------------------------------
	
	/**
	 * Create array out of | delimited string
	 *
	 * @access	public
	 * @return	array
	 *
	 */
	function get_array_from_delimited($pipedstr)
	{
		$data = array();
		list($data['title'], $data['description'], $data['duration'], $data['pubdate'], $data['thumbnail'], $data['mediatype'], $data['cid'], $data['yid'], $data['autoplay']) = explode('|', $pipedstr);
		foreach($data as $key => $val)
		{
			//$data[$key] = preg_replace('/"/g', '&quot;', $data[$key]);
			//$data[$key] = preg_replace("/'/g", '&apos;', $data[$key]);
			$data[$key] = htmlspecialchars($data[$key]);
		}
		return $data;
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * get | delimited string out of array
	 *
	 * @access	public
	 * @return	string
	 *
	 */
	function get_delimited_from_array($adata)
	{
		$data = array();
		foreach($adata as $key => $val)
		{
			$data[$key] = $val;
			//$data[$key] = preg_replace('/"/g', '&quot;', $data[$key]);
			//$data[$key] = preg_replace("/'/g", '&apos;', $data[$key]);
			$data[$key] = htmlspecialchars($data[$key]);
		}
		$dl = "|";
		if ($data['yid']){	
			$yid = $dl.$data['yid'];
		}else{
			$yid = "";
		}
		if ($data['autoplay']){
			$autoplay = $dl.$data['autoplay'];
		}else{
			$autoplay = "";
		}
		//cannot use implode because order is not guaranteed
		return $data['title'].$dl.$data['description'].$dl.$data['duration'].$dl.$data['pubdate'].$dl.$data['thumbnail'].$dl.$data['mediatype'].$dl.$data['cid'].$yid.$autoplay;
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Returns the markup for the field type
	 *
	 * @access	public
	 * @return	input markup
	 *
	 */
	function get_field_markup($data, $matrix = FALSE)
	{
		$this->helper->include_resources();
		$show = trim($this->settings['show']);
		if ( !empty($show) ){
			$this->EE->javascript->output('
		        if (video_audio && video_audio.setDefaultShow){
					video_audio.setDefaultShow("'.$this->settings['show'].'");
				}
		    ');
		}
		$this->EE->load->helper('date');
		$input_name = $this->field_name;
		
		if ($matrix)
		{
			$input_name = $this->cell_name;
		}
		$input = '<a class="media placeholder clearfix" href="#"><p><span>+</span>Select Clip</p><input type="hidden" name="'.$input_name.'" value=""/></a>';
		$md = false;
		if ($data)
		{
			$md = unserialize(base64_decode($data));
		}
		if (!$md || $md == "false"){
			return $input;
		}
		foreach($md as $key => $val)
		{
			$$key = $val;
		}
        
		if ($yid)
		{
			$yid = "&".$yid;
		}
		else
		{
			$yid = "";
		}
		$pubdate = $pubdate / 1000;
		$pubdate = mdate("%F %d, %Y", $pubdate);
		$input = '<a class="media '.$mediatype.' clearfix" href="#'.$cid.$yid.'"><img alt="" src="'.$thumbnail.'"><span class="cliptitle">'.$title.'</span><span class="pubdate">'.$pubdate.'</span><span class="duration">'.$duration.'</span><span class="summary">'.$description.'</span><span class="reload">Reload Metadata</span><span class="autoplay">'.$autoplay.'</span><span class="cleardata submit">Clear</span><input type="hidden" name="'.$input_name.'" value="'.$this->get_delimited_from_array($md).'"/></a>';
			
		return $input;
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Display Global Settings
	 *
	 * @access	public
	 * @return	form contents
	 *
	 */
	function display_global_settings()
	{
		$val = array_merge($this->settings, $_POST);
		
		$form = '';
		$form .= '<h3>Defaults</h3>';
		$form .= form_label('Show', 'show').NBS.form_input('show', $val['show']).NBS.NBS.NBS.' ';

		return $form;
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Save Field Data
	 *
	 * @access	public
	 * @return	array
	 *
	 */
	function save($data)
	{
		$this->EE->load->library('logger');
		$this->EE->logger->developer('Saving field data for '.$this->field_name);
		$this->EE->logger->developer($data);
		return base64_encode(serialize($this->get_array_from_delimited($data)));
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Save Global Settings
	 *
	 * @access	public
	 * @return	global settings
	 *
	 */
	function save_global_settings()
	{
		return array_merge($this->settings, $_POST);
	}
	
	// --------------------------------------------------------------------

	/**
	 * Save Settings
	 *
	 * @access	public
	 * @return	field settings
	 *
	 */
	function save_settings($data)
	{
		return array(
			'show'	=> $this->EE->input->post('show')
		);
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Display Settings Screen
	 *
	 * @access	public
	 * @return	default global settings
	 *
	 */
	function display_settings($data)
	{
		$show	= isset($data['show']) ? $data['show'] : $this->settings['show'];
		$this->EE->table->add_row(
			lang('show', 'show'),
			form_input('show', $show)
		);
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Install Fieldtype
	 *
	 * @access	public
	 * @return	default global settings
	 *
	 */
	function install()
	{
		return array(
			'url_base'		=> 'http://feed.theplatform.com/f/h9dtGB/c6DHQoxs77tr'
		);
	}
	// --------------------------------------------------------------------
	
	/**
	 * Replace Tag
	 *
	 * @access	public
	 * @return	string
	 *
	 */
	function replace_tag($fielddata, $params = array(), $tagdata = FALSE)
	{
			$this->EE->load->library('logger');
			$this->EE->logger->developer("hi");
			$this->EE->logger->developer("running replace tag for: $tagdata");
			
			if (!$tagdata){
				return "<strong>ERROR:</strong>Use the video_audio tag as a tag pair and/or use {video_audio:help} to see what template tags are available.";
			}
			$this->EE->load->helper('date');
			$md = unserialize(base64_decode($fielddata));
			$pubdate_format = "%F %d %Y";

			if (array_key_exists("pubdate_format",$params))
			{
				$pubdate_format = $params["pubdate_format"];
			}
			$md["pubdate"] = $md["pubdate"] / 1000;
			$md["pubdate"] = mdate($pubdate_format, $md["pubdate"]);
			//$this->EE->logger->developer(var_dump($md));
			
			$out = $this->EE->functions->var_swap($tagdata, $md);

			
			$this->EE->logger->developer($md["title"]);

			return $out;
	}
	// --------------------------------------------------------------------
	
	/**
	 * Replace Help
	 *
	 * @access	public
	 * @return	string
	 *
	 */
	function replace_help($fielddata, $params = array(), $tagdata = FALSE)
	{
		return "<p>The following tokens can be used inside the tag pair:</p>
		<ol>
			<li>cid - thePlatform clip id</li>
			<li>yid - the YoSpace clip id</li>
			<li>mediatype - 'video' or 'audio'</li>
			<li>thumbnail - the absolute path to the clip thumbnail</li>
			<li>title - the clip title</li>
			<li>description - the clip description</li>
			<li>duration - HH:MM:SS</li>
			<li>pubdate - default format is %F %d %Y. Add pubdate_format parameter to tag pair to change the format. Reference EE mdate().</li>
		</ol>";
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Replace Metadata
	 *
	 * @access	public
	 * @return	string
	 *
	 */
	function replace_player($fielddata, $params = array(), $tagdata = FALSE)
	{	
		return "<p>replacing tag with media player soon</p>";
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Display Cell for Matrix
	 *
	 * @access	public
	 * @return	String of HTML to be inserted into the Matrix cell in the Publish form
	 *
	 */
	function display_cell($data)
	{
		return $this->get_field_markup($data, TRUE);
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Save Cell for Matrix
	 *
	 * @access	public
	 * @return	array
	 *
	 */
	function save_cell($data)
	{
		return base64_encode(serialize($this->get_array_from_delimited($data)));
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Validate matrix cell data
	 *
	 * @access	public
	 * @return	validation error string or TRUE
	 *
	 */
	function validate_cell( $data )
	{
	  return TRUE;
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Display Cell for Low Variables
	 *
	 * @access	public
	 * @return	A string containing the HTML to be used in the module’s home page.
	 *
	 */
	function display_var_field($var_data)
	{
		return 'video audio field type low variables function';
	}
}
// END ft class

/* End of file ft.video_audio.php */
/* Location: ./system/expressionengine/third_party/video_audio/ft.video_audio.php */