# CLASS 1: Distributed Systems Foundations
**Condensed Study Guide**

---

## Core Definition
A **distributed system** is a collection of **independent nodes** that communicate via **network messages** and cooperate to achieve a **common objective**.

---

## Why Distribute? (vs. Monolith)

| Problem with Monolith | What Distribution Gives Us |
|----------------------|---------------------------|
| One machine ceiling on CPU/memory/storage | **Scale**: Spread load across many machines |
| One crash = entire service offline | **Availability**: One node fails, others continue |
| Deploy small fix = redeploy everything | **Performance**: Serve users from nearby data centers |
| Global users suffer from latency | **Team boundaries**: Teams own independent services |

---

## Single Program vs. Distributed System

| Aspect | Monolith | Distributed |
|--------|----------|-------------|
| **Location** | One process, one machine | Multiple processes, multiple machines |
| **Communication** | Function calls (in-process) | Network messages (unreliable) |
| **Failure Model** | Whole app crashes together | Partial failure possible |
| **Memory** | Shared memory | No shared memory; data explicitly sent |
| **Complexity** | Simple to build & debug | Added latency, uncertainty, partial failure |

---

## The Three Core Components

### 1. **Independent Nodes**
- Each node = separate process or machine
- Own state, clock, failure mode
- Can fail independently

### 2. **Message Passing**
- Only communication mechanism
- No shared memory
- Network can delay, lose, duplicate, reorder

### 3. **Common Objective**
- Despite independence, nodes cooperate
- Work together to deliver unified service

---

## What Makes a System Distributed?

✓ Independent components (separate processes)  
✓ Communication by messages (network)  
✓ No shared memory between nodes  
✓ Shared objective (common goal)  
✓ Possible independent failures (one can fail while others continue)

**NOT distributed**: Two threads on one machine (share memory, common fate)

---

## Running Example: Trip Booking

**Simple from user's perspective**: Click "Book Trip" → Get confirmation

**Behind the scenes**: Multiple independent services must cooperate

```
Client → Trip Service (coordinator)
         ├→ Flight Service (reserve seat)
         └→ Hotel Service (reserve room)
```

**Each arrow = a network message** that can succeed, fail, or be delayed

---

## What Can Go Wrong When Nodes Communicate?

Networks can **delay**, **lose**, **duplicate**, or **reorder** messages.

### Four Failure Scenarios (All Look the Same!)

From the client's perspective, all produce **silence**:

1. **Request Never Arrives**: Packet lost before server processes it
2. **Server Crashes Mid-Processing**: Request received, server crashes, no reply
3. **Reply Is Lost**: Server processed request but response dropped
4. **Reply Is Delayed**: Response arrives after client timeout

### **Timeout Ambiguity**
Client timeout tells you: "No response arrived in time"

It does NOT tell you:
- Was the request lost?
- Did the server crash?
- Is the server just slow?
- Did the response get lost?
- **All of these look identical to the client**

---

## Partial Failure: The Central Challenge

**Partial failure** = One node fails while others continue running

**In trip booking example**: 
- Flight service already reserved seat ✓
- Hotel service not responding ✗
- Trip coordinator stuck waiting, cannot tell why

**Key insight**: No global crash—just silence from one component

This is the **defining difficulty** of distributed systems.

---

## The Two Generals Problem

**Scenario**: Two generals on opposite sides of valley. Must coordinate attack. Only communication: messengers through enemy territory (any messenger can be captured).

**The Problem**: Can they ever be perfectly certain both will attack?

### Why Acknowledgements Don't Solve It

```
Gen A → Gen B: "Attack at dawn"
Gen B → Gen A: "Acknowledged"
Gen A → Gen B: "Acknowledged your acknowledgement"
...
```

**Every acknowledgement is itself a message that may be lost.**

### The Last Message Problem

- **Every acknowledgement** = a message that can be lost
- **Final message** = always uncertain
- **Finite exchange** cannot create perfect certainty
- Sender of last message cannot know if it was received

**Solution**: Real systems must be designed to **tolerate** uncertainty, not eliminate it.

---

## The Five Pillars of the Course

Every challenge in distributed systems maps to one of five concerns:

| Pillar | Question | Trip Example |
|--------|----------|--------------|
| **Communication** | How do services talk? | Trip Service calls Flight & Hotel Services |
| **Coordination** | How do services agree? | Flight succeeds; hotel response uncertain |
| **Scalability** | How handle growth? | Holiday traffic spike → many bookings at once |
| **Maintainability** | How evolve safely? | Change Hotel Service without breaking Trip Service |
| **Resilience** | How survive failure? | Hotel Service is slow or unavailable |

---

## Common Misconceptions

❌ "Distributed means cloud"  
✓ It means independent nodes communicating by messages

❌ "Remote call is like local function call"  
✓ Remote calls can timeout, duplicate, be lost, reorder

❌ "Timeout means server crashed"  
✓ Timeout only means no response arrived in time

❌ "More machines automatically make system better"  
✓ More machines add capacity BUT also coordination complexity

❌ "If each component works, whole system works"  
✓ Interactions can fail even when individual components are correct

---

## Key Takeaways

1. **Distributed system** = nodes + messages + common goal
2. **Distribution enables**: Scale, availability, geography, team boundaries
3. **Distribution adds**: Latency, uncertainty, partial failure
4. **Networks are unreliable**: Can delay, lose, duplicate, reorder
5. **Timeouts don't diagnose**: Only indicate no response arrived in time
6. **Partial failure** = one node fails while others continue
7. **Two Generals Problem** proves perfect certainty is impossible
8. **Real systems** must tolerate uncertainty, not eliminate it

---

## Self-Check Questions

- [ ] Can you define a distributed system in three components?
- [ ] Can you explain why one monolith can't scale like distributed system?
- [ ] Do you understand the four ways a network call can fail?
- [ ] Can you explain why more acknowledgements don't solve two generals?
- [ ] Can you identify the five pillars and give an example for each?
- [ ] Do you know why "distributed ≠ cloud"?
- [ ] Can you explain partial failure?

---

**Next**: Class 2 covers communication models (REST, RPC, gRPC, GraphQL, Messaging)
