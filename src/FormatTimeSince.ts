const FormatTimeSince = (startTime: bigint) => {
	const totalTimeNanos = process.hrtime.bigint() - startTime
	const millis = totalTimeNanos / 1000000n

	return `${Math.floor(Number(millis / 1000n / 60n))}m ${Math.floor(
		Number((millis / 1000n) % 60n)
	)}s ${millis % 1000n}ms`
}

export default FormatTimeSince
