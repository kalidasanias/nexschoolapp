package com.ga;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Simple Professor abstraction.
 */
public class Professor {
    private final int professorId;
    private final String professorName;
    private ArrayList<Integer> busyTimeslotIds = new ArrayList<Integer>(8);
    private ArrayList<Integer> intBusyTimeslotIds = new ArrayList<Integer>(8);
    private int overloadPeriods = 0;


    /**
     * Initalize new Professor
     * 
     * @param professorId The ID for this professor
     * @param professorName The name of this professor
     * @param busytimeslotIts of this professor
     */
    public Professor(int professorId, String professorName, ArrayList<Integer> busyTimeslotIds){
    	this.professorId = professorId;
    	this.professorName = professorName;
    	this.intBusyTimeslotIds = busyTimeslotIds;
    }
    
    /**
     * Initalize new Professor
     * 
     * @param professorId The ID for this professor
     * @param professorName The name of this professor
     */
    public Professor(int professorId, String professorName){
        this.professorId = professorId;
        this.professorName = professorName;
        this.busyTimeslotIds = new ArrayList<Integer>(5);
    }
    
    /**
     * Get professorId
     * 
     * @return professorId
     */
    public int getProfessorId(){
        return this.professorId;
    }
    
    /**
     * Get professor's name
     * 
     * @return professorName
     */
    public String getProfessorName(){
        return this.professorName;
    }

    /**
     * Get professor's busy time slots
     * 
     * @return busyTimeslotIds
     */
	public ArrayList<Integer> getBusyTimeslotIds() {
		ArrayList<Integer> mergeList = new ArrayList<Integer>(8);
		mergeList.addAll(busyTimeslotIds);
		mergeList.addAll(intBusyTimeslotIds);
		return mergeList;
	}
	
	private void checkBusyPeriodsLimitPerWeek(int period, int limit) {
		HashMap<Integer, Integer> timeslots = new HashMap<Integer, Integer>(6);
//		ArrayList<Integer> data = getBusyTimeslotIds();
//		int clashes = 0;
//	    for (int i = 0; i < data.size(); i++) {
//			Integer period = data.get(i);
			Integer day = period / 8 + 1;
			if (period % 8 == 0) {
				day--;
			}
			
			Integer numPeriodsPerDay = timeslots.get(day);
			if (numPeriodsPerDay == null){
				timeslots.put(day, 1);
			} else {
				numPeriodsPerDay++;
				if (limit >= numPeriodsPerDay) {
					overloadPeriods++;
				}
				timeslots.replace(day, numPeriodsPerDay);
			}
//		}
//	    return clashes;
	}
	 
	public ArrayList<Integer> getInitBusyTimeslotIds() {
		return intBusyTimeslotIds;
	}
	
	public void mergeToInitBusyIds() {
		this.intBusyTimeslotIds.addAll(busyTimeslotIds);
		this.busyTimeslotIds.clear();
	}
	
	public void clearBusyTimeslots() {
		this.busyTimeslotIds.clear();
	}
	
	public void addBusyTimeslotId(Integer timeslotId, int limit) {
		this.busyTimeslotIds.add(timeslotId);
		checkBusyPeriodsLimitPerWeek(timeslotId, limit);
	}
	
	public int getNumofOverloadedPeriods() {
		return overloadPeriods;
	}

}
