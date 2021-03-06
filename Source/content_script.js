function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{

    v = v.replace()

    // Baby Boomer
    v = v.replace(/\bBaby Boomer\b/g, "Entitled Elderly Person");
    v = v.replace(/\bbaby boomer\b/g, "entitled elderly person");
    v = v.replace(/\bBaby Boomer(?:(s)\b(')|s\b)/g, "Entitled Elderly People$2$1");
    v = v.replace(/\bbaby boomer(?:(s)\b(')|s\b)/g, "entitled elderly people$2$1");

    // Boomer
    v = v.replace(/\Boomer\b/g, "Entitled Elderly Person");
    v = v.replace(/\bboomer\b/g, "entitled elderly person");
    v = v.replace(/\bBoomer(?:(s)\b(')|s\b)/g, "Entitled Elderly People$2$1");
    v = v.replace(/\bboomer(?:(s)\b(')|s\b)/g, "entitled elderly people$2$1");

    return v;
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
