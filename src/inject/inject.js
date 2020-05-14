chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(handleMutationEvents);
      });

      // configuration of the observer:
      var config = {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
      };

      observer.observe(document, config);

      var handleMutationEvents = function handleMutationEvents(mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, styleLabelsInNode);
        styleLabelsInNode(mutation.target);
      }

      var styleLabelsInNode = function styleLabelsInNode(node) {
        if (nodeIsElement(node)) {
          styleLabels(findLabelsInNode(node));
        }
      }

      var nodeIsElement = function nodeIsElement(node) {
        return (typeof node.querySelectorAll !== 'undefined');
      }

      var findLabelsInNode = function findLabelsInNode(node) {
        return node.querySelectorAll('a.label');
      }

      var styleLabels = function styleLabels(labels) {
        Array.prototype.forEach.call(labels, function(label) {
          if (isLabelEligible(label.textContent)) {
            var story = findStory(label);
            if(!story) { return; }
            styleStoryIcon(story);
          }
        });
      }

      function findStory(label) {
        var currentNode = label;

        while(Array.prototype.indexOf.call(currentNode.classList, 'story') === -1) {
          currentNode = currentNode.parentElement;
          if(!currentNode) { return null; }
        }
        return currentNode;
      }

      function styleStoryIcon(story) {
        if(story.querySelector('header.preview div.meta')) {
          var meta = story.querySelector('header.preview .meta span[class^="StoryPreviewItem__storyType___"]');
          meta.classList.add("charter-story");
        }
      }
    }
  }, 10);
});
