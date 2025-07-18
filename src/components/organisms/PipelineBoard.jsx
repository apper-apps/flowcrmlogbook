import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { setLeads, updateLead } from "@/store/slices/pipelineSlice";
import { setSectionFilters } from "@/store/slices/uiSlice";
import { pipelineService } from "@/services/api/pipelineService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ListView from "@/components/molecules/ListView";
import CreateLeadModal from "@/components/organisms/CreateLeadModal";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "react-toastify";
import { format } from "date-fns";
const PipelineBoard = () => {
  const dispatch = useDispatch();
  const { leads, activePipeline } = useSelector((state) => state.pipeline);
  const { sectionFilters } = useSelector((state) => state.ui.listView);
  const { t } = useLanguage();
  const [stages, setStages] = useState([]);
  const [viewMode, setViewMode] = useState("board"); // board or list
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [leadsData, stagesData] = await Promise.all([
        pipelineService.getLeads(),
        pipelineService.getStages()
      ]);
      dispatch(setLeads(leadsData));
      setStages(stagesData);
    } catch (error) {
      toast.error(t("error"));
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const leadId = parseInt(draggableId);
    const lead = leads.find(l => l.Id === leadId);
    
    if (!lead) return;

    const updatedLead = {
      ...lead,
      stage: destination.droppableId,
      lastActivity: new Date().toISOString()
    };

    try {
      await pipelineService.updateLead(leadId, updatedLead);
      dispatch(updateLead(updatedLead));
      toast.success("Lead updated successfully");
    } catch (error) {
      toast.error(t("error"));
    }
  };

  const getLeadsByStage = (stageId) => {
    return leads.filter(lead => lead.stage === stageId);
  };

  const getStageValue = (stageId) => {
    const stageLeads = getLeadsByStage(stageId);
    return stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

const filters = [
    { label: "All Leads", value: "all" },
    { label: "New", value: "new" },
    { label: "Qualified", value: "qualified" },
    { label: "Proposal", value: "proposal" },
    { label: "Negotiation", value: "negotiation" },
    { label: "Closed Won", value: "closedWon" },
    { label: "Closed Lost", value: "closedLost" }
  ];

  const handleFilterChange = (filters) => {
    dispatch(setSectionFilters({ section: "pipeline", filters }));
  };

  const renderLeadItem = (lead, { rowSize }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {lead.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{lead.name}</h3>
            <p className="text-sm text-gray-400">{lead.company}</p>
            {rowSize !== "small" && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" size="sm">
                  {lead.stage}
                </Badge>
                <span className="text-xs text-gray-400">
                  {format(new Date(lead.lastActivity), "MMM dd")}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(lead.value || 0)}
            </p>
            {rowSize !== "small" && (
              <p className="text-xs text-gray-400">
                {lead.owner || "Unassigned"}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Mail" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Phone" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

return (
    <div className="h-full space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-4">
        <Button
          variant={viewMode === "board" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("board")}
        >
          <ApperIcon name="Columns" className="h-4 w-4 mr-2" />
          Board View
        </Button>
        <Button
          variant={viewMode === "list" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          <ApperIcon name="List" className="h-4 w-4 mr-2" />
          List View
        </Button>
      </div>

      {viewMode === "list" ? (
        <ListView
          items={leads}
          renderItem={renderLeadItem}
          filters={filters}
          section="pipeline"
          onFilterChange={handleFilterChange}
          selectedFilters={sectionFilters.pipeline}
          emptyState={
            <Card className="p-8 text-center">
              <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No leads yet</h3>
              <p className="text-gray-400 mb-4">
                Start by adding your first lead to begin tracking opportunities
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                {t("addLead")}
              </Button>
            </Card>
          }
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.Id} className="flex-shrink-0 w-80">
              <Droppable droppableId={stage.Id.toString()}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`h-full rounded-xl border-2 border-dashed transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-primary/50 bg-primary/5"
                        : "border-white/10"
                    }`}
                  >
                    {/* Stage Header */}
                    <div className="p-4 glass-dark rounded-t-xl border-b border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{stage.name}</h3>
                        <Badge variant="primary">
                          {getLeadsByStage(stage.Id.toString()).length}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {formatCurrency(getStageValue(stage.Id.toString()))}
                      </p>
                    </div>

                    {/* Stage Content */}
                    <div className="p-4 space-y-3 min-h-[500px]">
                      {getLeadsByStage(stage.Id.toString()).map((lead, index) => (
                        <Draggable
                          key={lead.Id}
                          draggableId={lead.Id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transform transition-all duration-200 ${
                                snapshot.isDragging
                                  ? "rotate-2 scale-105 shadow-2xl"
                                  : ""
                              }`}
                            >
                              <Card className="p-4 cursor-move hover:shadow-lg">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium text-white">
                                        {lead.name}
                                      </h4>
                                      <p className="text-sm text-gray-400">
                                        {lead.company}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-primary">
                                        {formatCurrency(lead.value || 0)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <ApperIcon name="Clock" className="h-3 w-3" />
                                    {format(new Date(lead.lastActivity), "MMM dd")}
                                  </div>

                                  {lead.tags && lead.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {lead.tags.slice(0, 2).map((tag, i) => (
                                        <Badge key={i} variant="secondary" size="sm">
                                          {tag}
                                        </Badge>
                                      ))}
                                      {lead.tags.length > 2 && (
                                        <Badge variant="default" size="sm">
                                          +{lead.tags.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                        <span className="text-xs font-medium text-white">
                                          {lead.owner?.charAt(0) || "U"}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-400">
                                        {lead.owner || "Unassigned"}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="sm">
                                        <ApperIcon name="Mail" className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <ApperIcon name="Phone" className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
          </div>
        </DragDropContext>
      )}
      
      <CreateLeadModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSuccess={loadData}
      />
    </div>
  );
};

export default PipelineBoard;