import { useState, useEffect } from 'react';
import { Box, Button, Fade } from '@mui/material';

import './styles/Global.css';

export default function Landing(){

  let fade_delay = 200;
  let fade_duration = 600;

  useEffect(() => {
    setTimeout(() => { set_title_fade(true) }, fade_delay * 4)
  }, [])

  let [title_fade, set_title_fade] = useState(false);
  let [subtitle_fade0, set_subtitle_fade0] = useState(false);
  let [subtitle_fade1, set_subtitle_fade1] = useState(false);
  let [subtitle_fade2, set_subtitle_fade2] = useState(false);
  let [icon_selections_fade, set_icon_selections_fade] = useState(false)

  let [toggle_state, set_toggle_state] = useState(true)

  let toggle_button = <Button onClick={() => {set_toggle_state(!toggle_state)}}>{toggle_state ? 'On' : 'Off'}</Button>

  let main_title = <Fade
    in={title_fade}
    onEntered={() => {setTimeout(() => { set_subtitle_fade0(true) }, fade_delay * 2)}}
    timeout={fade_duration}
  >
    <Box
      className='landing_title'
    >
      {'Zachary George Baker'}
    </Box>
  </Fade>

  let subtitle = <Box>
    <Fade
      in={subtitle_fade0}
      onEntered={() => {setTimeout(() => { set_subtitle_fade1(true) }, fade_delay)}}
      timeout={fade_duration}
    >
      <Box className='landing_subtitle'>Web Design</Box>
    </Fade>
    <Fade
      in={subtitle_fade1}
      onEntered={() => {setTimeout(() => { set_subtitle_fade2(true) }, fade_delay)}}
      timeout={fade_duration}
    >
      <Box className='landing_subtitle'>Data Science</Box>
    </Fade>
    <Fade
      in={subtitle_fade2}
      onEntered={() => {setTimeout(() => { set_icon_selections_fade(true) }, fade_delay)}}
      timeout={fade_duration}
    >
      <Box className='landing_subtitle'>Biomedical Engineering</Box>
    </Fade>
  </Box>

  let title = <Box>
    {main_title}
    {subtitle}
  </Box>

  let resume_button = <Button>
    R&Eacute;SUM&Eacute;
  </Button>

  let contact_button = <Button>
    CONTACT
  </Button>

  let icon_selections = <Fade
    in={icon_selections_fade}
    timeout={fade_duration}
  >
    <Box
      className='border1'
    >
      {resume_button}
      {contact_button}
    </Box>
  </Fade>

  let content = <Box
    className='Box'
  >
    {title}
    <Box className='gap' />
    {icon_selections}
  </Box>

  return content;

}