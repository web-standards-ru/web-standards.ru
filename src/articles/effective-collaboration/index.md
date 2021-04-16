---
title: ''
date: 2020-01-21
author: josh-comeau
source:
    title: 'Effective Collaboration with Product and Design'
    url: 'https://joshwcomeau.com/career/effective-collaboration'
translators:
    -
editors:
    - vadim-makeev
layout: article.njk
tags:
    - article
    - soft-skills
preview: ''
---

# Effective Collaboration with Product and Design

On Being a Good Teammate

If you had 15 minutes of a developer's time, and your goal was to help them become more effective/productive at their job by teaching them something you've learned, what would you pick?<!-- Tooltip: Framed another way, how would you fulfill the Geico promise: “15 minutes could save you 15% or more on development efforts”? -->

This blog post is my answer to that question. It's roughly a 15 minute read, and I believe it could potentially save you hundreds of hours of development effort throughout your career (among other benefits). I believe it's the highest-ROI tip I have, and I'm excited to talk about it 🙂

It's not about JavaScript, though, or even about programming more broadly. As a community, we've done an incredible job optimizing along the engineering axis; we have brilliant frameworks, tools, and services. I work for [Gatsby](https://gatsbyjs.com), and our primary focus is on making it dramatically faster to develop rich, performant, accessible web applications.

The problem-space we typically focus on has been well-harvested, and there's not as much low-hanging fruit left. But there are many other areas we can improve our skills in!

Most of the work we do, especially on the front-end, is intertwined with product and design. It's likely that you spend a good chunk of your time working on implementing a vision that other team members provide. Communication and trust play a huge role in how effectively we work together, and it can make an *enormous difference* in our velocity.

## Rainbow Road

I used to work for [Khan Academy](https://khanacademy.org), a non-profit organization on a mission to provide a free, world-class education to anyone, anywhere. I worked on the classroom team, building tools to be used by teachers and their students.

We discovered pretty quickly that teachers really dislike having product updates shipped mid-semester; it disrupts their workflow, and eats up extremely limited time. A teacher might only have 5 minutes before a class starts to check in on how their students are doing. Product releases disrupt that.

For this and many other reasons, Khan Academy structured most of their
releases around the “back-to-school” calendar: we aimed to have new stuff
launched by July/August, in time for the new school year (in the northern
hemisphere). Especially on the classroom team, we couldn't ship new features
after school started, so we had very firm deadlines.

In 2018, our squad worked on a project code-named *rainbow road*, centered around revamping the tools teachers use outside of class to understand what their students' needs are. Our plan was super aggressive: we were revamping 5 key product areas, and launching a bunch of new functionality. For a while, it was very uncertain whether we would actually finish in time!

In the end, we met all of our core commitments! Like in many real-world projects, there was a bit of creative scope-cutting needed, but we delivered a working product in time for back-to-school, and teachers (and their students!) really benefitted from the work we did.

I believe a huge part of how we were able to pull it off was the *tight collaboration* we had between product/design and engineering.

## Three levers

A product manager once told me that he had *three levers* he could pull on, in order to alleviate pressure when work is behind schedule:

- **People.** If a developer is overwhelmed with the amount of work they have to do, adding additional developers can help.
- **Time.** If the work is behind schedule, we can push the deadline back!
- **Scope.** If we can trim out some of the nice-to-haves, we can reduce the amount of work that needs to be done, while still delivering the critical experience, and solving for the original objective.

The first option, adding people, feels precarious to me. It can backfire; adding people doesn't always mean the work will get done faster. New developers need to gather a bunch of context, and sometimes that context exists only within the current developers' heads. Instead of speeding things up, it can slow things down.

The second option, time, might not be an option at all, especially if there are external, immovable deadlines. IMO this is an *underutilized lever* in our industry, but yeah sometimes you really can't push back a deadline.

That leaves the third option, scope.

Scope cuts are generally decided by product managers, but they don't make that decision alone. It often starts with a conversation between the designer and the developer. If these two people trust each other, the process is collaborative, cordial, and productive. They figure out the best solution under the current constraints, taking development time and user experience into account, and then pitch it to the PM. If the PM trusts the designer and developer, and their proposed solution works from a product perspective, it's typically approved without any fuss.

This workflow is awesome, and I believe it was critical in our success in the *Rainbow Road* project: if we weren't able to course-correct with so little friction, there's no way we would have been able to ship in time.

This workflow only works if all parties trust each other, though.

## It starts with empathy

So here's a fun exercise. Imagine you're at a party, and someone asks what you do. You mention that you're a developer for Company X. The person pulls out their phone and navigates to Company X's homepage, which is a page you built.

For many devs, there's a certain amount of pride with this kind of thing. The code that you wrote is running on this person's phone! Even though many other people worked very hard on it, you were the one who translated those efforts into a tangible, interactive thing. You were the final step in the process, and your work is on full display.

Now imagine that you're in the same situation, except you're the UI/UX designer who worked on Company X's homepage. The mockup you designed a few months ago is noticeably different from what you're seeing on this person's phone. The fonts are all wrong, the spacing is off, there's a weird glitch on scroll. It's not really your work. Not without a lot of asterisks and caveats, at least.

Designers work hard to create a design that looks good and works well for the end user, but their work is funneled through an implementation process, one which invariably leaves a mark. The end result will never exactly match their design. Sometimes, it's worlds apart. And yet, their professional reputation is often all about which real-world products they've delivered, not how many beautiful mockups they've designed.

This is a situation that can very easily lead to resentment and conflict. I've worked on teams where there was a pervasive icy tension between designers and developers. And, frankly, I think developers are to blame most of the time. It's usually our fault.

It's worth recognizing that we haven't always been perfect teammates. The first step in building trust with our design and product friends is to show them that we take their concerns seriously.

## “Nits”

Let's say we're chugging along on a non-urgent feature. We push a version of the change up to staging, and a day or two later we get some feedback from the designer:

- Change avatar border radius from 4px to 8px
- Add 8px spacing below avatar
- Keep content center-aligned between `md` and `lg` breakpoints
- Title should be `gray-900` color, not `gray-700`
- Text should show an ellipsis (…) if it's too long to fit on 3 lines.

We tend to describe these as “nitpicks” (which, incidentally, isn't a very kind way to describe this kind of feedback!). Generally what happens in these situations is that the developer tells the designer to create a ticket for these nits, where it'll likely be assigned a P4 and lost in a sea of other low-priority tickets.

How *should* we react to this kind of feedback?

### Collaborative implementation

First, we should figure out how much time we think it would take to fix these issues. Here's that list again:

- Change avatar border radius from 4px to 8px
- Add 8px spacing below avatar
- Keep content center-aligned between `md` and `lg` breakpoints
- Title should be `gray-900` color, not `gray-700`
- Text should show an ellipsis (…) if it's too long to fit on 3 lines.

The first 4 tweaks sound relatively trivial to me<!-- Tooltip: Presuming that these changes are permitted within the constraints of the design system + component library -->. I think it would take me about 5 minutes to fix them, maybe 30 minutes total
when factoring in all the process stuff (updating snapshot tests, code review,
etc).

The fifth one is tricky, though. If you've ever tried to deal with multi-line ellipsis on the web, you know that it's a dastardly problem with no simple CSS solution<!-- Tooltip: So it turns out, there *is* a way to do this now, with -webkit-line-clamp. It's a little buggy, though, so it's not quite a silver bullet.<br><br>For the purposes of this article, I'm pretending it doesn't exist. -->. You could easily spend an afternoon trying to get it sorted, and the solution would probably be janky.

In most cases, here's what I would do:

- Solve the first 4 problems
- Research and brainstorm about how I might address the designer's concern without needing to invest many hours or days of development time
- DM the designer to get feedback.

The message I send might look something like this:

> Hi [designer friend],
>
> Thanks for the feedback for [project name]!
>
> I've tackled most of the issues you spotted, and they should be pushed to staging in [reasonable timeframe], but one issue is surprisingly tricky: browsers don't provide a good built-in way to handle showing an ellipsis for multi-line text. There are third-party solutions, but they tend to be finicky and unreliable.
>
> I had a couple ideas for potential alternatives:
>
> - It's possible with CSS to do a single-line ellipsis - what if we only showed the first line?
> - Maybe we could limit it by # of characters instead? Say, cap it to 120 characters, with an ellipsis if it's longer?
> - Maybe we can clamp the height of the container, and make the container scrollable? So we'd still show all the text, but ensure it doesn't take up too much space on-screen.
>
> Let me know what you think!

The key thing here is that it shows I am taking their concerns seriously.

Another thing: designers usually aren't familiar enough with the web platform to be able to tell what's easy and what's hard (and they shouldn't need to be, since this is *our* job, not theirs). Multi-line ellipsis sounds like it should be easy, but we're saying it isn't. In effect, we're asking them to trust us.

Imagine if I had said something like this:

> Hi - some of your requested changes are non-trivial, so I won't be able to get to it. Sorry.

The designer might wonder, “is this actually a hard thing, or are they making excuses because they don't want to deal with it?”. They might think we're just giving them a canned line, so that we can get back to other work that interests us more.

This is how trust is made or broken. Designers often work with many different developers; they can tell which developers are making an earnest effort to implement their feedback, and which ones aren't interested.

It's important that we establish a trusting relationship, because these are the same people we'll be talking with when we're a week from a deadline and we need to make hard choices about scope.

Scope discussions involve a negotiation between what's best for the user and what's feasible given the current development constraints. If the designer knows that you're earnestly trying to find the best solution, they'll likely be more receptive to alternative suggestions, and much more willing to collaborate on a solution. If the designer feels like you're just trying to do the minimum possible, though, they'll likely stand firm and insist that the design is followed precisely.



### Do I need to come up with alternatives?

Coming up with suitable alternatives is a skill on its own. You may find yourself in a predicament, where you recognize that the design will be very hard to implement as-specified, but you also don't have any other ideas.

You shouldn't let that stop you from starting a conversation. I would say something like this:

> Hi there - I saw that the design features [seemingly-simple thing]. Unfortunately, because of [technical constraint], implementing this would probably take 3-4 days of development time. I wanted to check and see how critical this element is before I invest that kind of time, and see if maybe you had alternative ideas we could try.

The person who designed the mockup has spent a lot of time thinking about that screen, and they likely already have multiple alternative ideas. They might not even think the element in question is that important, and maybe you can omit it altogether.

What you *don't* want to do is assume that everything on the design is written in stone. You might spend a week implementing a multi-line ellipsis only to learn that the work was totally unnecessary!

## Covert operations

In the above hypothetical scenario, I took the liberty of taking half an hour to implement the easier parts of the designer's feedback. I didn't check with my manager, or the team lead, I just did it.

Depending on where you work, you may or may not have this kind of autonomy. At some organizations, it may be considered unusual for developers to take on work that wasn't explicitly assigned by a PM.

If you work in an environment like this, designers probably don't have any expectation that you'll address these concerns anyway, so it's a bit of a different situation. Good communication is the most important part; you can still have that discussion around workarounds and optimal solutions, even if you're not authorized to implement the fixes yet.

I also have a little trick I really like; if I finish a task early and have some extra time to spare, I'll DM a team member and ask if they have any lingering tickets they'd like me to look at. It could be a designer, or a member of the support team, or someone in sales.

Often, folks in these roles will have a couple of tickets that are very important to them, and yet those tickets never seem to find their way into the active sprint. Typically, the reply I get will look like:

> OMG YES I've been trying to get this ticket solved for 3 months, it's affecting a lot of users and I don't understand why it isn't being taken more seriously. Thank you thank you thank you.

In these cases, I like to pretend that I'm on an undercover mission - I'll do things "off the record" when it comes to Jira tickets, and I won't broadcast that I'm working on it (though of course I'll still be honest if anyone asks, and I'll probably bring it up in the next standup, after the fact).

It's worth pointing out that as a cis white guy, I am privileged enough that I can get away with stuff like this without worrying about any repercussions. Unfortunately, your experience might vary, especially if you're an underrepresented minority in tech. A safer bet might be to reach out to your PM and ask for permission first, instead of forgiveness later.

## “Should designers code?”

Every few months, this question is asked on Design Twitter, and everyone jumps in with hot takes. I am not a designer, and am woefully out of my depth when it comes to answering this question, but I do have one strong opinion: if designers *want* to code, we should do whatever we can to enable them.

I've worked on teams where designers knew CSS, and wanted to be able to make small tweaks, stuff like adjusting font sizes and positions. Sometimes, developers are hesitant—there's a concern that it will eat up a bunch of their time. Especially if the codebase is complex and has a lot of quirks (which is very nearly every codebase?), the concern goes like this: “It would take me longer to teach you how to fix it than it would for me to just fix it myself”.

The problem is that we often say this *while ignoring* a pile of tickets that designers have opened. We can't have it both ways; either we agree to promptly address any design feedback we receive, *or* we find a way to empower designers to make those changes themselves (if they want to). While it might take a bit more developer time upfront, it's an investment in the future.

It's a bit of a sad statement that designers are sometimes willing to learn an *entirely different trade* because they see it as the easiest way to make sure that their designs are correctly implemented 😬

Also, we shouldn't underestimate designers' ability to make sense of our code. Yes, coding is hard, but it's not as mystical as we like to believe.
<!-- Tooltip: On a flight, I once sat next to someone who figured that software developers were "like in The Matrix", working with 0s and 1s. She was very underwhelmed when I showed her what our job *actually* looked like. -->

## Deeper collaboration during development

The conventional way to build software, "waterfall", was a multi-step process: first, design did all the user research and sketching and prototyping and creating high fidelity mockups. Once they were confident their work was finished, they'd toss it over the wall to the development team, and wouldn't hear anything about it until it was just about ready to go live.

As I'm sure many people have experienced, this is not an ideal way to work. As developers, we have critical information needed for a successful design process. We know what data is and isn't available in our database. We understand the web platform and its limitations. In short, we know which ideas will be easy to implement, and which will be next-to-impossible.

Happily, the industry is moving to a more agile model, where developers are involved earlier. There's no more rude awakenings when a design that has spent months being polished is immediately tossed back over the wall because it's not possible to implement.

But this is only half of the story. It's also critically important that design remains actively involved throughout implementation!

Many developers work in isolation, and they keep the feature pretty close to the chest until it's nearly finished. This can lead to a number of not-great scenarios:

- The developer might have missed the fact that there was an on-enter animation specified, and that animation totally isn't possible because of how they structured their code
- The designer might suddenly realize, seeing it populated with real data, that a bunch of their original assumptions were wrong, and that this all needs to be rethought.
- The developer might have misunderstood how the views should scale *between* the specified screen sizes.
- The designer might not have known that there would be a 3-second loading spinner before the main view loaded. After discussion, the designer learns that the slowest piece of data is the least important. A new design is produced, removing the slow piece of data, and rearranging everything else to make it work.
- A million other things like this.

In all of these scenarios, how much time could have been saved by having a designer involved earlier?

I try hard to give designers access to my work early and often. I'll send GIFs of critical flows and behaviours the second I have a working prototype on my machine. When possible, I'll deploy to staging, so that designers can try things hands-on.

A static mockup can never perfectly capture the essence of using a product, and designers sometimes need to see how it *feels* before they have conidence in their approach. The sooner we can get a prototype in the designer's hands, the earlier we'll know if there's a problem, and the less work we'll have to do.

## Develop a design intuition

There's a pervasive myth that design and development are polar opposites, and that they're mutually exclusive skills. Design is seen as creative and artistic and abstract, whereas development is seen as logical and rational and concrete.

I think that's all wrong. Design, like music and everything else, has rules and constraints. Given certain inputs, you'll produce certain outputs. Sure, there's a human element of infusing those rules with creativity and personality, but the same thing can be said for development! If programming was as rational and concrete as people say, we wouldn't waste so much time trying to convince everyone else that *our* way of doing things is the best way.

Also, I submit Exhibit B: *creative coding*:

> **Content warning:** The video-GIFs include motion that may be harmful for folks with vestibular disorders.

<blockquote>
    <p>
        Playing around again with Jared Tarbell's classic Substrate algorithm.
    </p>
    <p>
        Lines grow outward, and upon colliding with another line, it produces a new line at a different angle.
    </p>
    <p>
        <a href="https://twitter.com/hashtag/javascript">#javascript</a> <a href="https://twitter.com/hashtag/generative">#generative</a> <a href="https://twitter.com/hashtag/canvas">#canvas</a>
    </p>
    <video preload="none" poster="https://pbs.twimg.com/tweet_video_thumb/EM0vLUgXsAETAj1.jpg" src="https://video.twimg.com/tweet_video/EM0vLUgXsAETAj1.mp4" width="640" height="640" type="video/mp4" controls loop></video>
    <footer>
        <cite>
            <a href="https://twitter.com/mattdesl/status/1210675775747301381">@mattdesl</a>
        </cite>
    </footer>
</blockquote>

<blockquote>
    <p>
        :)
    </p>
    <video preload="none" poster="https://pbs.twimg.com/tweet_video_thumb/EJzili8UcAAD663.jpg" src="https://video.twimg.com/tweet_video/EJzili8UcAAD663.mp4" width="720" height="800" type="video/mp4" controls loop></video>
    <footer>
        <cite>
            <a href="https://twitter.com/beesandbombs/status/1197081207894183936">@beesandbombs</a>
        </cite>
    </footer>
</blockquote>

<blockquote>
    <p>
        Perlin noise overprints
    </p>
    <p>
        <a href="https://twitter.com/hashtag/moiré">#moiré</a> <a href="https://twitter.com/hashtag/plottertwitter">#plottertwitter</a>
    </p>
    <img alt="" src="https://pbs.twimg.com/media/ENMmZYVU4AEXlsD?format=jpg" width="900" height="1200">
    <footer>
        <cite>
            <a href="https://twitter.com/netpraxis/status/1212354990963970048">@netpraxis</a>
        </cite>
    </footer>
</blockquote>

You may think that you'd be "bad at design" because you're bad at drawing, or don't feel like a particularly artistic person, but I promise you that the fundamentals are more more rooted in logic and math than you think. And I think developing a rudimentary level of design skill can be incredibly powerful, for a bunch of reasons:

- If you work on side-projects, or like the idea of starting something, you likely won't be able to afford a designer, and yet you probably still want it to be well-designed.
- It teaches you a common language you can share with designers, a way to communicate more effectively, about things like [affordance](https://uxplanet.org/ux-design-glossary-how-to-use-affordances-in-user-interfaces-393c8e9686e4) and [information architecture](https://uxplanet.org/information-architecture-basics-for-designers-b5d43df62e20).
- It gives you additional ways to leverage your intuition.

That last one is interesting, and worth digging into a little bit.

Whether you realize it or not, you're constantly making design decisions and relying on your intuition. Mockups never specify what should happen in 100% of cases, and in the process of implementing them, we'll find dozens or hundreds of little things not explicitly specified in the mockup.

I've been honing my design intuition for years, and I believe I have a pretty good instinct for most things now. It's been a fantastic investment. I can use my judgment for most things that come along. I still reach out with questions, but my questions tend to be higher-level now, more around structure and flow rather than pixel positions.
<!-- Tooltip: Although let's be real — I still get this staff wrong sometimes too -->

In order to start developing your design instinct, I have a couple tips:

- If your organization has a design system, spend some time learning *why* things are the way they are. For example, you might have a `<Button>` component with different types: `primary`,`secondary`,`tertiary`. Design systems will often be very explicit about which type should be used when.
- Speak with your designers! Try and learn more about why they structured things the way they did. Instead of simply absorbing what they've specified, try and understand why they've specified it. You work with talented experts who are usually happy to teach interested developers!

Integrating these habits into your existing workflow should offer pretty noticeable benefits without a ton of extra investment, but if you're really into this idea, here are some additional resources that could prove helpful:

- [Refactoring UI](https://refactoringui.com/book), a book written by a designer specifically for developers.
- [Don't Make Me Think, by Steve Krug](https://amazon.ca/Dont-Make-Think-Revisited-Usability/dp/0321965515/ref=pd_sbs_14_t_0/142-9119805-5166140?_encoding=UTF8&pd_rd_i=0321965515&pd_rd_r=24a545f2-e73d-40b5-a144-1bce4b469385&pd_rd_w=6yGuB&pd_rd_wg=881L7&pf_rd_p=9926bb69-42b9-46e4-b788-f665992e326d&pf_rd_r=28D4D66KJ5RYBFSYA754&psc=1&refRID=28D4D66KJ5RYBFSYA754) - long considered an essential read for learning about UX (User Experience) design.
- [Design for Developers](https://frontendmasters.com/courses/design-for-developers), a Frontend Masters course run by Sarah Drasner, jam-packed with great info.
- [Practical Typography](https://practicaltypography.com), a wonderful introduction to the rules and constraints of typography, written By Matthew Butterick.

## Conclusion

It's early in the new decade, and many of us have goals to improve our developer skills. Technical ability is undoubtedly important, but it's only 1 aspect to being a good developer, and we often overlook other aspects that are just as important.

When folks talk about the “10x developer”, I often worry they're imagining a developer who writes code 10x faster than a normal developer (or, worse, a dev who writes 10x the amount of code 😬). What *I* imagine is a developer who provides 10x the *value* to an organization. And developers who are effective collaborators with design provide a **ton** of value.

Pretty much every time I've been promoted in my career, my ability to collaborate with product & design was listed as one of my greatest strengths. Organizations really appreciate developers who work on this skillset, since it means features get shipped more quickly and with less stress / conflict.

Let's review: here are the concrete ways in which I think we can increase the value we provide by working more effectively with product/design:

- When we're under a looming deadline, good communication is key in finding the right compromises, to help us work around hairy technical problems while still delivering a good user experience. This requires that we've put in the effort to develop trust first.
- By making sure to keep design in the loop while we develop, we can course-correct early if our implementation starts to driff off the road.
- By developing a design intuition, we get better at both of these tasks, and so many others. We gain the ability to *know* the answers to questions that might have blocked us previously. We can contribute more to the process, and feel a greater sense of ownership over the finished product.

The premise of this blog post is that a 15-minute read could save you a ton of development effort in the future—and I hope I've accomplished that goal!—but this post has a sneaky ulterior motive. I want us to start pulling our weight when it comes to design-developer collaboration. You may feel like “pixel pushing” is a tedious drag, that you wish you could spend all your time on business logic and code architecture and performance optimizations… But that's no excuse to half-ass it. Our design team deserves partners who take implementation as seriously as they do.

### Additional reading

- [Why You Should Include Your Developer In The Design Process](https://www.smashingmagazine.com/2014/11/why-you-should-include-your-developer-in-the-design-process), by Paul Boag. This article (as relevant today as it was when it was published in 2014) is geared towards designers, but I think developers should read it too. I was nodding along so hard while reading it, I hurt my neck.
- [How Frontend Developers Can Empower Designer’s Work](https://www.smashingmagazine.com/2019/10/frontend-developers-empower-designers-work), by Sandrina Pereira. A post I discovered halfway through writing this one, and which covers almost all the same ground. I promise I didn't plagiarize!

## Thanks

Special thanks to Dustin, Shannon, and Flo for reading and editing!
