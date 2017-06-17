I am pretty particular about how I write CSS, in that I like to have my styles cascade in order of length (ascending)

For example, as opposed to this:

foo[name="bar"] {
    text-decoration: underline;
    color: #fff;
    background: #000000;
    float: left;
}

I prefer this: 

foo[name="bar"] {
    color: #fff;
    float: left;
    background: #000000;
    text-decoration: underline;
}

In the case where two rules are the same length, I will put them in alphabetical order.

This small utility will take a (valid only) CSS stylesheet and style it as I prefer. Maybe you will come to prefer it this way too ;)
