import ConditionInterface from "./ConditionInterface.js";
import ReactionSampleInterface from "./ReactionSampleInterface.js";
import TemperatureInterface from "./TemperatureInterface.js";
import DurationInterface from "./DurationInterface.js";
type ReactionType = Array<ReactionSampleInterface | ConditionInterface | TemperatureInterface | DurationInterface>;

export default ReactionType;
