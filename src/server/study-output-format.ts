/** Match the existing result contracts; domain validation still checks meaning and references. */
export function studyOutputFormat(kind: 'material' | 'quiz' | 'mindmap' | 'topic-memory' | 'study-pack' | 'photo-outline' = 'material') {
  const str = { type: 'string' };
  const strings = { type: 'array', items: str };
  const object = (properties: Record<string, unknown>) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
  const array = (items: unknown) => ({ type: 'array', items });
  if (kind === 'photo-outline') return {type:'json_schema',name:'photo_outline',strict:true,schema:object({title:str, rows:array(object({id:str,parentId:{anyOf:[str,{type:'null'}]},name:str,content:str,page:str,photoIds:strings,uncertain:{type:'boolean'}})),warnings:strings})};
  const topic = kind === 'topic-memory';
  const diagnostic = object({kind: {type:'string',enum:topic ? ['needs-input','insufficient-evidence'] : ['needs-input','insufficient-evidence','partial']},message:str,questions:strings,...(!topic ? {sourceIds:strings} : {})});
  const card = object({question:str,answer:str,...(topic ? {topicId:str} : {sourceIds:strings})});
  const properties: Record<string, unknown> = {cards:array(card),diagnostics:array(diagnostic)};
  if (!topic) properties.summary = array(object({text:str,sourceIds:strings,evidenceType:{type:'string',enum:['material-grounded','general-supplement']}}));
  if (['quiz','study-pack'].includes(kind)) properties.quiz = array(object({question:str,options:strings,correctIndex:{type:'integer'},explanation:str,sourceIds:strings}));
  if (['mindmap','study-pack'].includes(kind)) properties.map = {anyOf:[object({nodes:array(object({id:str,label:str,sourceIds:strings})),edges:array(object({id:str,from:str,to:str,label:str,sourceIds:strings}))}),{type:'null'}]};
  return {type:'json_schema',name:'study_result',strict:true,schema:object(properties)};
}
