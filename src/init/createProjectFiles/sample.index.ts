export default `import { retryError, eventNotSupportedError } from './utils/errors'
// Learn more about destination functions API at
// https://segment.com/docs/connections/destinations/destination-functions

/**
 * Handle track event
 * @param  {SegmentTrackEvent} event
 * @param  {FunctionSettings} settings
 */
export async function onTrack(event: Record<string, any>, settings: Record<string, any>) {
	// Learn more at https://segment.com/docs/connections/spec/track/
	const endpoint = ''; // replace with your endpoint
	let response;

	try {
		response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: ${"`Basic ${ btoa(settings.apiKey + ':') } `"},
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(event)
		});
	} catch (error) {
		// Retry on connection error
		throw retryError((error as Error).message);
	}

	if (response.status >= 500 || response.status === 429) {
		// Retry on 5xx (server errors) and 429s (rate limits)
		throw retryError(${'`Failed with ${ response.status } `'});
	}
}

/**
 * Handle identify event
 * @param  {SegmentIdentifyEvent} event
 * @param  {FunctionSettings} settings
 */
export async function onIdentify(event: Record<string, any>, settings: Record<string, any>) {
	// Learn more at https://segment.com/docs/connections/spec/identify/
	throw eventNotSupportedError('identify is not supported');
}

/**
 * Handle group event
 * @param  {SegmentGroupEvent} event
 * @param  {FunctionSettings} settings
 */
export async function onGroup(event: Record<string, any>, settings: Record<string, any>) {
	// Learn more at https://segment.com/docs/connections/spec/group/
	throw eventNotSupportedError('group is not supported');
}

/**
 * Handle page event
 * @param  {SegmentPageEvent} event
 * @param  {FunctionSettings} settings
 */
export async function onPage(event: Record<string, any>, settings: Record<string, any>) {
	// Learn more at https://segment.com/docs/connections/spec/page/
	throw eventNotSupportedError('page is not supported');
}

/**
 * Handle screen event
 * @param  {SegmentScreenEvent} event
 * @param  {FunctionSettings} settings
 */
export async function onScreen(event: Record<string, any>, settings: Record<string, any>) {
	// Learn more at https://segment.com/docs/connections/spec/screen/
	throw eventNotSupportedError('screen is not supported');
}

/**
 * Handle alias event
 * @param  {SegmentAliasEvent} event
 * @param  {FunctionSettings} settings
 */
export async function onAlias(event: Record<string, any>, settings: Record<string, any>) {
	// Learn more at https://segment.com/docs/connections/spec/alias/
	throw eventNotSupportedError('alias is not supported');
}

/**
 * Handle delete event
 * @param  {SegmentDeleteEvent} event
 * @param  {FunctionSettings} settings
 */
export async function onDelete(event: Record<string, any>, settings: Record<string, any>) {
	// Learn more at https://segment.com/docs/partners/spec/#delete
	throw eventNotSupportedError('delete is not supported');
}

export async function onBatch(events: Record<string, any>[], settings: Record<string, any>) {
	// Learn more at https://segment-docs.netlify.app/docs/connections/functions/destination-functions/#batching-the-destination-function
	throw eventNotSupportedError('onBatch is not supported');
}
`;
