import { useState, useEffect } from 'react';
import { Box, Button, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import './styles/Global.css';
import { fade_delay, fade_duration, selectionButtonSx } from './settings'


export default function Landing(){
  // Landing is the main page, which allows the user to access my Resume (via google docs) or navigate to the Gallery

  // fades title in after delay
  useEffect(() => {
    setTimeout(() => { set_title_fade(true) }, fade_delay * 4)
  }, [])

  // states
  let [title_fade, set_title_fade] = useState(false);
  let [subtitle_fade0, set_subtitle_fade0] = useState(false);
  let [icon_selections_fade, set_icon_selections_fade] = useState(false)

  // main title (my name)
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

  // Flavor text giving people an idea of what I'm looking for
  let subtitle_text = '"I love to build tools and pipelines that automate data organization, visualization, and processing. Seeking to grow as a data scientist or software engineer in a position that leverages my background, skills, and passion in an environment that fosters personal and professional growth."'
  let subtitle = <Box>
    <Fade
      in={subtitle_fade0}
      onEntered={() => {setTimeout(() => { set_icon_selections_fade(true) }, fade_delay)}}
      timeout={fade_duration}
    >
      <Box className='landing_subtitle'>{subtitle_text}</Box>
    </Fade>
  </Box>

  // Button linking to Google Doc of my general resume (view-only)
  let resume_button = <Button
    href="https://drive.google.com/file/d/15gnySn957sGs8mCR9FHMjeJUXGJTcxLv/view?usp=sharing"
    target="_blank"
    sx={selectionButtonSx}
  >
    R&Eacute;SUM&Eacute;
  </Button>

  // Button routing to the Gallery page on the website, showcasing data visualizations
  let gallery_button = <Button
    component={Link}
    to="/gallery"
    sx={selectionButtonSx}
  >
    GALLERY
  </Button>

  // organize selection buttons
  let icon_selections = <Fade
    in={icon_selections_fade}
    timeout={fade_duration}
  >
    <Box className='iconSelections'>
      {resume_button}
      <Box className='gap10h'/>
      {gallery_button}
    </Box>
  </Fade>

  // text linking this frontend's code repo on GitHub
  let disclosure = <Fade
    in={icon_selections_fade}
    timeout={fade_duration}
  >
    <Box className='disclosure'>
      This is a sample react frontend application coded and deployed entirely by me, Zachary George Baker. It is intended to demonstrate my
      ability to program and deploy a dashboard showcasing data.<br />
      All code is comitted <a href="https://github.com/zgbaker54/zacharygeorgebaker/tree/master" target='_blank' rel="noreferrer">here</a>.
    </Box>
  </Fade>

  // organize all content for Landing
  let content = <Box
    className='Box'
  >
    {main_title}
    {subtitle}
    <Box className='gap15v' />
    {icon_selections}
    <Box className='gap15v' />
    {disclosure}
  </Box>
  return content;

}