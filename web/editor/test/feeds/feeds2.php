<?php
include_once('./simple_html_dom.php');

$data = <<<EEE
It seems that getting <a href="http://en.wikipedia.org/wiki/Depression_%28mood%29">depressed</a> is the worse thing can happen to an entrepreneur.<br /><br />Very few people understand how difficult is to create a new thing. Most of them hear success stories and think that all of those people were struck by a great luck.<br /><br />I do not want to say luck is not important but most of them worked hard to acheive that success.<br />Also for 1 success there are other 20 failures (or even greater in IT).<br /><br />Depression can appear as the result a few of reasons (list not complete):<br /><ul><li>people desert you when you most need them</li><li>none seems to understand you or share the vision with you</li><li>no investor seems a "deal" in you or your ideea</li><li>no one even ask you a question or leave a comment on your blog</li><li>you work too much</li><li>you did not allocate time for fun  (or for youself)</li><li>the level of problems (read bugs if you are in IT) are so high that you ask yourself if you are producing bugs instead of code<br /></li></ul>All of those reasons might make you give up.<br /><br /><span style="font-weight: bold;">Don't do that!</span><br /><br />Ancient christian monks described that state of mind as <a href="http://en.wikipedia.org/wiki/Acedia">acedia</a>. You can recognize it by the fact that you do not want anyhing. You are just bored and tired. You want to give up.<br /><br /><span style="font-weight: bold;">Don't do it!</span><br /><br />Then is your time, then you can rise and yell (in your mind)<br /><br />I WILL NOT GIVE UP! NEVER!<br /><br />See this <a href="http://www.youtube.com/watch?v=AW579icDRSA">guy </a>and think about your life.<div class="blogger-post-footer"><img width='1' height='1' src='https://blogger.googleusercontent.com/tracker/1219993430316064175-3343993815890449030?l=blog.diagramo.com' alt='' /></div>
EEE;

$html = new simple_html_dom($data);

print $html->plaintext;
?>
