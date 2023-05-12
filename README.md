# README

### Setup

yarn add "reaction-svg-composer"

adjust following files:

ReactionDetails.js

```javascript
  updateReactionSvg() {
    const { reaction } = this.state;
    ReactionSvgFetcher.fetchByReaction(reaction).then((result) => {
      reaction.reaction_svg_file = result.reaction_svg;
      this.setState(reaction);
    });
  }
```

ReactionSvgFetcher.js

```javascript
import { ReactionRenderer, DisplayMatrix } from 'reaction-svg-composer';
export default class ReactionSvgFetcher {
  static fetchByReaction(elnReaction) {
    return ReactionRenderer.convertELNReaction(elnReaction).then((reactionArray) => {
      const displayMatrix = DisplayMatrix.createDisplayMatrixFromELNReaction(elnReaction);
      const rr = new ReactionRenderer(displayMatrix, reactionArray);
      return { reaction_svg: rr.renderReaction() };
    });
  }
}
```

ElementActions.js

```javascript
  handleSvgReactionChange(reaction) {
    return () => {
      ReactionSvgFetcher.fetchByReaction(reaction).then((result) => {
        reaction.reaction_svg_file = result.reaction_svg;
      });
    };
  }
```

### Development

to work locally without building navigate into chemotion_eln

```
npm link reaction-svg-composer
```

navigate to into reaction-svg-composer and execute

```
npm link
yarn compile
```
